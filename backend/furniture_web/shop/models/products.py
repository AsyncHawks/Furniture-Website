from django.db import models
from django.utils.text import slugify
from .category import Category


class Product(models.Model):
    """Main product model"""
    
    AVAILABILITY_CHOICES = [
        ('in', 'In Stock'),
        ('out', 'Out of Stock'),
        ('pre', 'Pre-Order'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    general_category = models.CharField(max_length=100, default='Home Decor')
    vendor = models.CharField(max_length=255, default='Vendor Name')
    
    # Pricing
    min_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Description
    description = models.TextField()
    features = models.JSONField(default=list, blank=True)
    
    # Shipping & Availability
    free_shipping = models.BooleanField(default=False)
    available = models.CharField(max_length=3, choices=AVAILABILITY_CHOICES, default='in')
    items_in_stock = models.IntegerField(default=0)
    sold = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    @property
    def price(self):
        """Return price as array [min_price, max_price] or just min_price"""
        if self.max_price:
            return [float(self.min_price), float(self.max_price)]
        return float(self.min_price)


class ProductImage(models.Model):
    """Product images model"""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField(max_length=500)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'
    
    def __str__(self):
        return f"{self.product.title} - Image {self.order}"


class ProductVariant(models.Model):
    """Product variants (e.g., sizes, types)"""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    variant_id = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_default = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['price']
        verbose_name = 'Product Variant'
        verbose_name_plural = 'Product Variants'
        unique_together = ['product', 'variant_id']
    
    def __str__(self):
        return f"{self.product.title} - {self.title}"
