from rest_framework import serializers
from shop.models import Cart, CartItem, Product, ProductVariant


class CartItemProductSerializer(serializers.ModelSerializer):
    """Minimal product info for cart items"""
    
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'image']
    
    def get_image(self, obj):
        first_image = obj.images.first()
        return first_image.image_url if first_image else None


class CartItemVariantSerializer(serializers.ModelSerializer):
    """Minimal variant info for cart items"""
    
    id = serializers.CharField(source='variant_id')
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'title', 'price']


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items"""
    
    product = CartItemProductSerializer(read_only=True)
    variant = CartItemVariantSerializer(read_only=True)
    unitPrice = serializers.SerializerMethodField()
    totalPrice = serializers.SerializerMethodField()
    
    # For write operations
    product_id = serializers.IntegerField(write_only=True)
    variant_id = serializers.CharField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'variant', 'quantity',
            'unitPrice', 'totalPrice',
            'product_id', 'variant_id'
        ]
    
    def get_unitPrice(self, obj):
        return obj.unit_price
    
    def get_totalPrice(self, obj):
        return obj.total_price


class CartSerializer(serializers.ModelSerializer):
    """Serializer for cart"""
    
    items = CartItemSerializer(many=True, read_only=True)
    totalItems = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'totalItems', 'subtotal', 'total', 'created_at', 'updated_at']
    
    def get_totalItems(self, obj):
        return obj.total_items
    
    def get_subtotal(self, obj):
        return float(obj.subtotal)
    
    def get_total(self, obj):
        return float(obj.total)


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart"""
    
    product_id = serializers.IntegerField()
    variant_id = serializers.CharField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, default=1)
    
    def validate_product_id(self, value):
        if not Product.objects.filter(id=value).exists():
            raise serializers.ValidationError("Product not found")
        return value
    
    def validate(self, data):
        product_id = data.get('product_id')
        variant_id = data.get('variant_id')
        
        if variant_id:
            product = Product.objects.get(id=product_id)
            if not product.variants.filter(variant_id=variant_id).exists():
                raise serializers.ValidationError({"variant_id": "Variant not found for this product"})
        
        return data


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity"""
    
    quantity = serializers.IntegerField(min_value=0)
