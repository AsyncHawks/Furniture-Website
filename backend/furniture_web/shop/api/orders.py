from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db import transaction
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from shop.models import Order, OrderItem, Cart, CartItem
from shop.serializers import (
    OrderListSerializer,
    OrderDetailSerializer,
    CreateOrderSerializer,
)
from shop.utils import send_order_confirmation_email


@swagger_auto_schema(
    method='get',
    operation_description="Get list of user's orders",
    operation_id="list_user_orders",
    tags=['Orders'],
    responses={
        200: openapi.Response(
            description="List of orders",
            schema=OrderListSerializer(many=True)
        )
    }
)
@swagger_auto_schema(
    method='post',
    operation_description="Create order from cart items",
    operation_id="create_order",
    tags=['Orders'],
    request_body=CreateOrderSerializer,
    responses={
        201: openapi.Response(
            description="Order created successfully",
            schema=OrderDetailSerializer
        ),
        400: openapi.Response(description="Validation error or empty cart")
    }
)
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def create_order(request):
    """Create order from cart or direct product data, or list orders"""
    if request.method == 'GET':
        # List user's orders if authenticated
        if request.user.is_authenticated:
            orders = Order.objects.filter(user=request.user).prefetch_related('items')
            serializer = OrderListSerializer(orders, many=True)
            return Response({"orders": serializer.data}, status=status.HTTP_200_OK)
        return Response({"orders": []}, status=status.HTTP_200_OK)
    
    # POST - Create order
    serializer = CreateOrderSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if products are provided directly in the request (from frontend checkout)
    products_data = serializer.validated_data.get('products', {})
    
    # Create order in transaction
    try:
        with transaction.atomic():
            if products_data:
                # Direct order creation from frontend product data
                subtotal = 0
                order_items_data = []
                
                # Calculate subtotal and prepare order items
                from shop.models import Product, ProductVariant
                from django.db.models import Q
                
                for product_identifier, item_data in products_data.items():
                    try:
                        # Get product using productId from item_data (not the dict key)
                        product_id = item_data.get('productId', product_identifier)
                        if str(product_id).isdigit():
                            product = Product.objects.get(id=product_id)
                        else:
                            product = Product.objects.get(slug=product_id)
                        
                        variant = None
                        variant_title = ''
                        
                        if item_data.get('variantId'):
                            variant_identifier = item_data['variantId']
                            # Lookup variant by variant_id field (not id or slug)
                            try:
                                variant = ProductVariant.objects.get(
                                    product=product,
                                    variant_id=variant_identifier
                                )
                                unit_price = variant.price
                                variant_title = variant.title
                            except ProductVariant.DoesNotExist:
                                print(f"Variant not found: {variant_identifier} for product {product.id}")
                                unit_price = product.price
                        else:
                            unit_price = product.price
                        
                        quantity = item_data.get('quantity', 1)
                        total_price = unit_price * quantity
                        subtotal += total_price
                        
                        order_items_data.append({
                            'product': product,
                            'variant': variant,
                            'product_title': product.title,
                            'variant_title': variant_title,
                            'unit_price': unit_price,
                            'quantity': quantity,
                            'total_price': total_price,
                        })
                    except (Product.DoesNotExist, ProductVariant.DoesNotExist):
                        continue
                
                if not order_items_data:
                    return Response(
                        {"error": "No valid products found in order"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                shipping_cost = 0
                tax = 0
                discount = 0
                total = subtotal + shipping_cost + tax - discount
                
            else:
                # Legacy: Order creation from cart
                cart = None
                if request.user.is_authenticated:
                    try:
                        cart = Cart.objects.get(user=request.user)
                    except Cart.DoesNotExist:
                        return Response(
                            {"error": "Cart is empty. Please add items to cart before placing order."},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                else:
                    session_id = request.session.session_key
                    if not session_id:
                        request.session.create()
                        session_id = request.session.session_key
                    
                    try:
                        cart = Cart.objects.get(session_id=session_id)
                    except Cart.DoesNotExist:
                        return Response(
                            {"error": "Cart is empty. Please add items to cart before placing order."},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
                if not cart.items.exists():
                    return Response(
                        {"error": "Cannot create order from empty cart"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                subtotal = cart.subtotal
                shipping_cost = 0
                tax = 0
                discount = 0
                total = subtotal + shipping_cost + tax - discount
                order_items_data = []
                
                for cart_item in cart.items.all():
                    order_items_data.append({
                        'product': cart_item.product,
                        'variant': cart_item.variant,
                        'product_title': cart_item.product.title,
                        'variant_title': cart_item.variant.title if cart_item.variant else '',
                        'unit_price': cart_item.unit_price,
                        'quantity': cart_item.quantity,
                        'total_price': cart_item.total_price,
                    })
            
            # Create order
            order = Order.objects.create(
                user=request.user if request.user.is_authenticated else None,
                email=serializer.validated_data['email'],
                full_name=serializer.validated_data['full_name'],
                phone=serializer.validated_data['phone'],
                shipping_address=serializer.validated_data['shipping_address'],
                shipping_city=serializer.validated_data['shipping_city'],
                shipping_state=serializer.validated_data['shipping_state'],
                shipping_postal_code=serializer.validated_data['shipping_postal_code'],
                shipping_country=serializer.validated_data.get('shipping_country', 'Pakistan'),
                payment_method=serializer.validated_data.get('payment_method', 'cash_on_delivery'),
                order_notes=serializer.validated_data.get('order_notes', ''),
                subtotal=subtotal,
                shipping_cost=shipping_cost,
                tax=tax,
                discount=discount,
                total=total,
            )
            
            # Create order items
            for item_data in order_items_data:
                OrderItem.objects.create(
                    order=order,
                    product=item_data['product'],
                    variant=item_data['variant'],
                    product_title=item_data['product_title'],
                    variant_title=item_data['variant_title'],
                    unit_price=item_data['unit_price'],
                    quantity=item_data['quantity'],
                    total_price=item_data['total_price'],
                )
                
                # Reduce stock for the product
                product = item_data['product']
                if product.items_in_stock >= item_data['quantity']:
                    product.items_in_stock -= item_data['quantity']
                    product.sold += item_data['quantity']
                    product.save()
                else:
                    # If stock is insufficient, set to 0 and mark as out of stock
                    product.sold += product.items_in_stock
                    product.items_in_stock = 0
                    product.available = 'out'
                    product.save()
            
            # Clear user's cart after successful order
            if request.user.is_authenticated:
                # Clear authenticated user's cart
                user_cart = Cart.objects.filter(user=request.user, is_active=True).first()
                if user_cart:
                    user_cart.items.all().delete()
            else:
                # Clear guest cart
                session_id = request.session.session_key
                if session_id:
                    guest_cart = Cart.objects.filter(session_id=session_id, is_active=True).first()
                    if guest_cart:
                        guest_cart.items.all().delete()
        
            # Send order confirmation email
            send_order_confirmation_email(order)
        
            order_serializer = OrderDetailSerializer(order)
            return Response({
                "message": "Order created successfully",
                "order": order_serializer.data
            }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print(f"Error creating order: {type(e).__name__}: {str(e)}")  # Debug
        import traceback
        traceback.print_exc()
        return Response({
            "error": f"Failed to create order: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='get',
    operation_description="Get list of user's orders",
    operation_id="list_orders",
    tags=['Orders'],
    responses={
        200: openapi.Response(
            description="List of orders",
            schema=OrderListSerializer(many=True)
        )
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_orders(request):
    """Get list of user's orders"""
    orders = Order.objects.filter(user=request.user).prefetch_related('items')
    serializer = OrderListSerializer(orders, many=True)
    return Response({"orders": serializer.data}, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Get detailed information about a specific order",
    operation_id="get_order",
    tags=['Orders'],
    manual_parameters=[
        openapi.Parameter(
            'order_id',
            openapi.IN_PATH,
            description="Order ID or order number",
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Order details",
            schema=OrderDetailSerializer
        ),
        404: openapi.Response(description="Order not found")
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_order(request, order_id=None, id=None):
    """Get order details"""
    # Support both order_id and id parameters for different URL patterns
    lookup_id = order_id or id
    if not lookup_id:
        return Response(
            {"error": "Order ID is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Try to get by ID first, then by order number
    try:
        if str(lookup_id).isdigit():
            order = get_object_or_404(Order, id=lookup_id)
        else:
            order = get_object_or_404(Order, order_number=lookup_id)
    except:
        return Response(
            {"error": "Order not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = OrderDetailSerializer(order)
    return Response({"order": serializer.data}, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    operation_description="Cancel an order (only if status is pending)",
    operation_id="cancel_order",
    tags=['Orders'],
    manual_parameters=[
        openapi.Parameter(
            'order_id',
            openapi.IN_PATH,
            description="Order ID",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Order cancelled",
            schema=OrderDetailSerializer
        ),
        400: openapi.Response(description="Cannot cancel order"),
        404: openapi.Response(description="Order not found")
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    """Cancel an order"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    
    if order.status != 'pending':
        return Response(
            {"error": "Only pending orders can be cancelled"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    order.status = 'cancelled'
    order.save()
    
    serializer = OrderDetailSerializer(order)
    return Response({
        "message": "Order cancelled successfully",
        "order": serializer.data
    }, status=status.HTTP_200_OK)
