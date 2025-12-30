from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from shop.models import Cart, CartItem, Product, ProductVariant
from shop.serializers import (
    CartSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
)


def get_or_create_cart(request):
    """Get or create cart for user or session"""
    if request.user.is_authenticated:
        # Get active cart for authenticated user
        cart = Cart.objects.filter(user=request.user, is_active=True).first()
        if not cart:
            cart = Cart.objects.create(user=request.user, is_active=True)
    else:
        # For guest users, use session
        session_id = request.session.session_key
        if not session_id:
            request.session.create()
            session_id = request.session.session_key
        cart = Cart.objects.filter(session_id=session_id, is_active=True).first()
        if not cart:
            cart = Cart.objects.create(session_id=session_id, is_active=True)
    return cart


def merge_guest_cart_to_user(user, session_id):
    """Merge guest cart items into user's cart"""
    try:
        # Get guest cart
        guest_cart = Cart.objects.filter(session_id=session_id, is_active=True).first()
        if not guest_cart or guest_cart.items.count() == 0:
            return
        
        # Get or create user cart
        user_cart = Cart.objects.filter(user=user, is_active=True).first()
        if not user_cart:
            user_cart = Cart.objects.create(user=user, is_active=True)
        
        # Merge items from guest cart to user cart
        for guest_item in guest_cart.items.all():
            # Check if item already exists in user cart
            user_item = CartItem.objects.filter(
                cart=user_cart,
                product=guest_item.product,
                variant=guest_item.variant
            ).first()
            
            if user_item:
                # Update quantity
                user_item.quantity += guest_item.quantity
                user_item.save()
            else:
                # Move item to user cart
                guest_item.cart = user_cart
                guest_item.save()
        
        # Deactivate guest cart
        guest_cart.is_active = False
        guest_cart.save()
    except Exception as e:
        pass  # Silently handle merge errors


@swagger_auto_schema(
    method='get',
    operation_description="Get current user's cart with all items",
    operation_id="get_cart",
    tags=['Cart'],
    responses={
        200: openapi.Response(
            description="Cart details",
            schema=CartSerializer
        )
    }
)
@swagger_auto_schema(
    method='put',
    operation_description="Update cart (add items)",
    operation_id="update_cart",
    tags=['Cart'],
    request_body=AddToCartSerializer,
    responses={
        200: openapi.Response(
            description="Cart updated",
            schema=CartSerializer
        )
    }
)
@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])
def get_cart(request):
    """Get or update user's cart"""
    if request.method == 'PUT':
        # Handle PUT request - add item to cart
        serializer = AddToCartSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        cart = get_or_create_cart(request)
        
        product_id = serializer.validated_data['product_id']
        variant_id = serializer.validated_data.get('variant_id')
        quantity = serializer.validated_data.get('quantity', 1)
        
        # Get product and variant
        product = get_object_or_404(Product, id=product_id)
        variant = None
        if variant_id:
            variant = get_object_or_404(ProductVariant, product=product, variant_id=variant_id)
        
        # Check if item already exists in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # Item exists, update quantity
            cart_item.quantity += quantity
            cart_item.save()
        
        # Make sure session is saved
        request.session.save()
        
        cart_serializer = CartSerializer(cart)
        return Response({
            "message": "Item added to cart",
            "cart": cart_serializer.data
        }, status=status.HTTP_200_OK)
    
    cart = get_or_create_cart(request)
    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    operation_description="Add item to cart",
    operation_id="add_to_cart",
    tags=['Cart'],
    request_body=AddToCartSerializer,
    responses={
        200: openapi.Response(
            description="Item added to cart",
            schema=CartSerializer
        ),
        400: openapi.Response(description="Validation error")
    }
)
@api_view(['POST'])
@permission_classes([AllowAny])
def add_to_cart(request):
    """Add item to cart"""
    serializer = AddToCartSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    cart = get_or_create_cart(request)
    
    product_id = serializer.validated_data['product_id']
    variant_id = serializer.validated_data.get('variant_id')
    quantity = serializer.validated_data.get('quantity', 1)
    
    # Get product and variant
    product = get_object_or_404(Product, id=product_id)
    variant = None
    if variant_id:
        variant = get_object_or_404(ProductVariant, product=product, variant_id=variant_id)
    
    # Check if item already exists in cart
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        variant=variant,
        defaults={'quantity': quantity}
    )
    
    if not created:
        # Item exists, update quantity
        cart_item.quantity += quantity
        cart_item.save()
    
    # Make sure session is saved
    request.session.save()
    
    cart_serializer = CartSerializer(cart)
    return Response({
        "message": "Item added to cart",
        "cart": cart_serializer.data
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='put',
    operation_description="Update cart item quantity",
    operation_id="update_cart_item",
    tags=['Cart'],
    request_body=UpdateCartItemSerializer,
    manual_parameters=[
        openapi.Parameter(
            'item_id',
            openapi.IN_PATH,
            description="Cart item ID",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Cart item updated",
            schema=CartSerializer
        ),
        404: openapi.Response(description="Item not found")
    }
)
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_cart_item(request, item_id):
    """Update cart item quantity"""
    serializer = UpdateCartItemSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    cart = get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    
    new_quantity = serializer.validated_data['quantity']
    
    if new_quantity == 0:
        # Remove item from cart
        cart_item.delete()
        message = "Item removed from cart"
    else:
        # Update quantity
        cart_item.quantity = new_quantity
        cart_item.save()
        message = "Cart item updated"
    
    cart_serializer = CartSerializer(cart)
    return Response({
        "message": message,
        "cart": cart_serializer.data
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='delete',
    operation_description="Remove item from cart",
    operation_id="remove_from_cart",
    tags=['Cart'],
    manual_parameters=[
        openapi.Parameter(
            'item_id',
            openapi.IN_PATH,
            description="Cart item ID",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Item removed from cart",
            schema=CartSerializer
        ),
        404: openapi.Response(description="Item not found")
    }
)
@api_view(['DELETE'])
@permission_classes([AllowAny])
def remove_from_cart(request, item_id):
    """Remove item from cart"""
    cart = get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    cart_item.delete()
    
    cart_serializer = CartSerializer(cart)
    return Response({
        "message": "Item removed from cart",
        "cart": cart_serializer.data
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='delete',
    operation_description="Clear all items from cart",
    operation_id="clear_cart",
    tags=['Cart'],
    responses={
        200: openapi.Response(description="Cart cleared")
    }
)
@api_view(['DELETE'])
@permission_classes([AllowAny])
def clear_cart(request):
    """Clear all items from cart"""
    cart = get_or_create_cart(request)
    cart.items.all().delete()
    
    cart_serializer = CartSerializer(cart)
    return Response({
        "message": "Cart cleared",
        "cart": cart_serializer.data
    }, status=status.HTTP_200_OK)
