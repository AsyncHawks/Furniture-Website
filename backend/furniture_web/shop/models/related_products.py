from django.db import models
from .products import Product


class BuyTogether(models.Model):
    """Products frequently bought together"""
    
    main_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='buy_together_items')
    related_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='bought_with')
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Buy Together'
        verbose_name_plural = 'Buy Together Items'
        unique_together = ['main_product', 'related_product']
    
    def __str__(self):
        return f"{self.main_product.title} + {self.related_product.title}"


class RelatedProduct(models.Model):
    """Related/Similar products"""
    
    main_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='related_items')
    related_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='related_to')
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Related Product'
        verbose_name_plural = 'Related Products'
        unique_together = ['main_product', 'related_product']
    
    def __str__(self):
        return f"{self.main_product.title} -> {self.related_product.title}"
