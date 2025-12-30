from rest_framework import serializers
from shop.models import Order, OrderItem, Product, ProductVariant


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items"""
    
    productTitle = serializers.CharField(source='product_title')
    variantTitle = serializers.CharField(source='variant_title')
    unitPrice = serializers.DecimalField(source='unit_price', max_digits=10, decimal_places=2)
    totalPrice = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'productTitle', 'variantTitle', 'unitPrice', 'quantity', 'totalPrice']


class OrderListSerializer(serializers.ModelSerializer):
    """Serializer for order list view"""
    
    orderNumber = serializers.CharField(source='order_number')
    fullName = serializers.CharField(source='full_name')
    paymentStatus = serializers.CharField(source='payment_status')
    createdAt = serializers.DateTimeField(source='created_at')
    
    class Meta:
        model = Order
        fields = [
            'id', 'orderNumber', 'fullName', 'status',
            'paymentStatus', 'total', 'createdAt'
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    """Serializer for order detail view"""
    
    orderNumber = serializers.CharField(source='order_number')
    fullName = serializers.CharField(source='full_name')
    paymentStatus = serializers.CharField(source='payment_status')
    paymentMethod = serializers.CharField(source='payment_method')
    shippingAddress = serializers.CharField(source='shipping_address')
    shippingCity = serializers.CharField(source='shipping_city')
    shippingState = serializers.CharField(source='shipping_state')
    shippingPostalCode = serializers.CharField(source='shipping_postal_code')
    shippingCountry = serializers.CharField(source='shipping_country')
    shippingCost = serializers.DecimalField(source='shipping_cost', max_digits=10, decimal_places=2)
    orderNotes = serializers.CharField(source='order_notes')
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'orderNumber', 'email', 'fullName', 'phone',
            'shippingAddress', 'shippingCity', 'shippingState',
            'shippingPostalCode', 'shippingCountry',
            'status', 'paymentStatus', 'paymentMethod',
            'subtotal', 'shippingCost', 'tax', 'discount', 'total',
            'orderNotes', 'items', 'createdAt', 'updatedAt'
        ]


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating an order - accepts frontend nested structure"""
    
    # Accept nested structure from frontend
    region = serializers.CharField(required=False, allow_blank=True)
    shippingAddress = serializers.DictField(required=True)
    billingAddress = serializers.DictField(required=False)
    billingSameAsShipping = serializers.BooleanField(default=True)
    products = serializers.DictField(required=False)
    
    # Also accept flat structure for backwards compatibility
    email = serializers.EmailField(required=False, allow_blank=True)
    full_name = serializers.CharField(max_length=255, required=False)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    shipping_address = serializers.CharField(required=False)
    shipping_city = serializers.CharField(max_length=100, required=False)
    shipping_state = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    shipping_postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    shipping_country = serializers.CharField(max_length=100, required=False, default='Pakistan')
    payment_method = serializers.CharField(max_length=50, required=False, default='cash_on_delivery')
    order_notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        # Transform nested frontend structure to flat structure
        if 'shippingAddress' in data:
            shipping = data['shippingAddress']
            data['email'] = shipping.get('email', '')
            data['full_name'] = f"{shipping.get('firstName', '')} {shipping.get('lastName', '')}".strip()
            data['phone'] = shipping.get('phone', '')
            data['shipping_address'] = shipping.get('address', '')
            data['shipping_city'] = shipping.get('city', '')
            data['shipping_state'] = shipping.get('state', '')
            data['shipping_postal_code'] = shipping.get('postalCode', '')
            
            # Map region to country
            region = data.get('region', 'pakistan')
            data['shipping_country'] = 'Pakistan' if region == 'pakistan' else 'Other'
        
        # Validate required fields with better error messages
        errors = {}
        
        if not data.get('email') or not data.get('email').strip():
            errors['email'] = 'Email is required'
        if not data.get('full_name') or not data.get('full_name').strip():
            errors['full_name'] = 'Full name is required'
        if not data.get('shipping_address') or not data.get('shipping_address').strip():
            errors['shipping_address'] = 'Shipping address is required'
        if not data.get('shipping_city') or not data.get('shipping_city').strip():
            errors['shipping_city'] = 'City is required'
        
        # Validate products if provided
        if 'products' in data and not data['products']:
            errors['products'] = 'At least one product is required'
        
        if errors:
            raise serializers.ValidationError(errors)
            
        return data
