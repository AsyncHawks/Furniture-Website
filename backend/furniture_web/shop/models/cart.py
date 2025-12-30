from django.db import models
from django.conf import settings
from .products import Product, ProductVariant


class Cart(models.Model):
    """Shopping cart model"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='carts',
        null=True,
        blank=True
    )
    session_id = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Cart'
        verbose_name_plural = 'Carts'
        constraints = [
            models.UniqueConstraint(
                fields=['user'],
                condition=models.Q(is_active=True, user__isnull=False),
                name='one_active_cart_per_user'
            ),
            models.UniqueConstraint(
                fields=['session_id'],
                condition=models.Q(is_active=True, session_id__isnull=False),
                name='one_active_cart_per_session'
            )
        ]
    
    def __str__(self):
        if self.user:
            return f"Cart for {self.user.email}"
        return f"Guest Cart {self.session_id}"
    
    @property
    def total_items(self):
        """Total number of items in cart"""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def subtotal(self):
        """Calculate subtotal of all items"""
        return sum(item.total_price for item in self.items.all())
    
    @property
    def total(self):
        """Calculate total (can add tax, shipping later)"""
        return self.subtotal


class CartItem(models.Model):
    """Cart item model"""
    
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Cart Item'
        verbose_name_plural = 'Cart Items'
        unique_together = ['cart', 'product', 'variant']
    
    def __str__(self):
        variant_info = f" - {self.variant.title}" if self.variant else ""
        return f"{self.product.title}{variant_info} x {self.quantity}"
    
    @property
    def unit_price(self):
        """Get unit price from variant or product"""
        if self.variant:
            return float(self.variant.price)
        return float(self.product.min_price)
    
    @property
    def total_price(self):
        """Calculate total price for this item"""
        return self.unit_price * self.quantity
