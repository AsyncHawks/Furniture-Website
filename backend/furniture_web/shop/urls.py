from django.urls import path
from .api import (
    category_list, category_detail,
    product_list, product_detail,
    get_cart, add_to_cart, update_cart_item, remove_from_cart, clear_cart,
    create_order, list_orders, get_order, cancel_order
)

urlpatterns = [
    # Categories
    path('categories/', category_list, name='category-list'),
    path('categories/<str:id_or_slug>/', category_detail, name='category-detail'),
    
    # Products
    path('products/', product_list, name='product-list'),
    path('products/<str:id_or_slug>/', product_detail, name='product-detail'),
    
    # Cart
    path('cart/', get_cart, name='get-cart'),
    path('cart/add/', add_to_cart, name='add-to-cart'),
    path('cart/items/<int:item_id>/', update_cart_item, name='update-cart-item'),
    path('cart/items/<int:item_id>/remove/', remove_from_cart, name='remove-from-cart'),
    path('cart/clear/', clear_cart, name='clear-cart'),
    
    # Orders
    path('orders/', create_order, name='orders'),  # POST to create, GET handled separately if needed
    path('orders/list/', list_orders, name='list-orders'),
    path('orders/<str:order_id>/', get_order, name='get-order'),
    path('orders/<int:order_id>/cancel/', cancel_order, name='cancel-order'),
    
    # Order endpoints matching frontend
    path('place-order', create_order, name='place-order'),
    path('track-order/<str:id>/', get_order, name='track-order'),
]
