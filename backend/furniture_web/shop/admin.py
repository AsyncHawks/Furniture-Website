from django.contrib import admin
from .models import (
    Category, Product, ProductImage, ProductVariant,
    BuyTogether, RelatedProduct, Cart, CartItem, Order, OrderItem
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image_url', 'order']


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ['variant_id', 'title', 'price', 'is_default']


class BuyTogetherInline(admin.TabularInline):
    model = BuyTogether
    fk_name = 'main_product'
    extra = 1
    fields = ['related_product', 'order']


class RelatedProductInline(admin.TabularInline):
    model = RelatedProduct
    fk_name = 'main_product'
    extra = 1
    fields = ['related_product', 'order']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'min_price', 'max_price', 'available', 'items_in_stock', 'sold', 'created_at']
    list_filter = ['category', 'available', 'free_shipping', 'created_at']
    search_fields = ['title', 'description', 'vendor']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at']
    
    inlines = [ProductImageInline, ProductVariantInline, BuyTogetherInline, RelatedProductInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'collection', 'general_category', 'vendor')
        }),
        ('Pricing', {
            'fields': ('min_price', 'max_price')
        }),
        ('Description', {
            'fields': ('description', 'features')
        }),
        ('Inventory & Shipping', {
            'fields': ('available', 'items_in_stock', 'sold', 'free_shipping')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )





@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'variant_id', 'title', 'price', 'is_default']
    list_filter = ['product', 'is_default']
    search_fields = ['product__title', 'variant_id', 'title']


@admin.register(BuyTogether)
class BuyTogetherAdmin(admin.ModelAdmin):
    list_display = ['main_product', 'related_product', 'order']
    list_filter = ['main_product']
    search_fields = ['main_product__title', 'related_product__title']


@admin.register(RelatedProduct)
class RelatedProductAdmin(admin.ModelAdmin):
    list_display = ['main_product', 'related_product', 'order']
    list_filter = ['main_product']
    search_fields = ['main_product__title', 'related_product__title']


# ==================== CART & ORDER ADMIN ====================

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    fields = ['product', 'variant', 'quantity', 'unit_price', 'total_price']
    readonly_fields = ['unit_price', 'total_price']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_id', 'total_items', 'subtotal', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'session_id']
    readonly_fields = ['created_at', 'updated_at', 'total_items', 'subtotal', 'total']
    inlines = [CartItemInline]
    
    fieldsets = (
        ('Cart Information', {
            'fields': ('user', 'session_id')
        }),
        ('Summary', {
            'fields': ('total_items', 'subtotal', 'total')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'variant', 'quantity', 'unit_price', 'total_price']
    list_filter = ['cart', 'product']
    search_fields = ['product__title', 'cart__user__email']
    readonly_fields = ['unit_price', 'total_price', 'created_at', 'updated_at']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ['product_title', 'variant_title', 'unit_price', 'quantity', 'total_price']
    readonly_fields = ['product_title', 'variant_title', 'unit_price', 'quantity', 'total_price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'full_name', 'email', 'status',
        'payment_status', 'total', 'created_at'
    ]
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'email', 'full_name', 'phone']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status', 'payment_status', 'payment_method')
        }),
        ('Customer Details', {
            'fields': ('email', 'full_name', 'phone')
        }),
        ('Shipping Address', {
            'fields': (
                'shipping_address', 'shipping_city', 'shipping_state',
                'shipping_postal_code', 'shipping_country'
            )
        }),
        ('Billing Address', {
            'fields': (
                'billing_address', 'billing_city', 'billing_state',
                'billing_postal_code', 'billing_country'
            ),
            'classes': ('collapse',)
        }),
        ('Pricing', {
            'fields': ('subtotal', 'shipping_cost', 'tax', 'discount', 'total')
        }),
        ('Notes', {
            'fields': ('order_notes', 'admin_notes'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_title', 'variant_title', 'quantity', 'unit_price', 'total_price']
    list_filter = ['order']
    search_fields = ['order__order_number', 'product_title']
    readonly_fields = ['total_price', 'created_at']
