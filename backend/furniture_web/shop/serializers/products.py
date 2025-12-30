from rest_framework import serializers
from shop.models import Product, ProductImage, ProductVariant, BuyTogether, RelatedProduct


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for product images"""
    
    class Meta:
        model = ProductImage
        fields = ['image_url', 'order']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Serializer for product variants"""
    
    id = serializers.CharField(source='variant_id')
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'title', 'price']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list view"""
    
    price = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'images', 'variants']
    
    def get_price(self, obj):
        return obj.price
    
    def get_images(self, obj):
        images = obj.images.all()[:2]
        return [img.image_url for img in images]


class BuyTogetherProductSerializer(serializers.ModelSerializer):
    """Serializer for products in buy together section"""
    
    images = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True, read_only=True)
    price = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'images', 'variants']
    
    def get_images(self, obj):
        images = obj.images.all()[:2]
        return [img.image_url for img in images]
    
    def get_price(self, obj):
        return obj.price


class RelatedProductSerializer(serializers.ModelSerializer):
    """Serializer for related products"""
    
    price = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'images', 'variants']
    
    def get_price(self, obj):
        return obj.price
    
    def get_images(self, obj):
        images = obj.images.all()[:2]
        return [img.image_url for img in images]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single product view"""
    
    price = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    generalCategory = serializers.CharField(source='general_category')
    freeShipping = serializers.BooleanField(source='free_shipping')
    itemsInStock = serializers.IntegerField(source='items_in_stock')
    createdAt = serializers.DateField(source='created_at', format='%Y-%m-%d')
    variants = ProductVariantSerializer(many=True, read_only=True)
    buyTogether = serializers.SerializerMethodField()
    relatedProducts = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'price', 'slug', 'categories', 'generalCategory',
            'vendor', 'description', 'features', 'images', 'freeShipping',
            'available', 'sold', 'itemsInStock', 'createdAt', 'variants',
            'buyTogether', 'relatedProducts'
        ]
    
    def get_price(self, obj):
        return obj.price
    
    def get_images(self, obj):
        return [img.image_url for img in obj.images.all()]
    
    def get_categories(self, obj):
        return [obj.category.name]
    
    def get_buyTogether(self, obj):
        buy_together_items = BuyTogether.objects.filter(main_product=obj).select_related('related_product').prefetch_related('related_product__images', 'related_product__variants')
        products = [item.related_product for item in buy_together_items]
        return BuyTogetherProductSerializer(products, many=True).data
    
    def get_relatedProducts(self, obj):
        related_items = RelatedProduct.objects.filter(main_product=obj).select_related('related_product').prefetch_related('related_product__images', 'related_product__variants')
        products = [item.related_product for item in related_items]
        return RelatedProductSerializer(products, many=True).data
