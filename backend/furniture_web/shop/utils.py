from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


def send_order_confirmation_email(order):
    """Send order confirmation email to customer"""
    try:
        subject = f'Order Confirmation - {order.order_number}'
        
        # Create email message with order details
        message = f"""
Dear {order.full_name},

Thank you for your order!

Order Details:
--------------
Order Number: {order.order_number}
Order Date: {order.created_at.strftime('%B %d, %Y at %I:%M %p')}
Payment Method: {order.get_payment_method_display() if hasattr(order, 'get_payment_method_display') else order.payment_method}

Items Ordered:
"""
        
        # Add order items
        for item in order.items.all():
            variant_info = f" - {item.variant_title}" if item.variant_title else ""
            message += f"\n{item.quantity}x {item.product_title}{variant_info} - Rs. {item.total_price}"
        
        # Add pricing details
        message += f"""

Pricing:
--------
Subtotal: Rs. {order.subtotal}
Shipping: Rs. {order.shipping_cost}
Tax: Rs. {order.tax}
Discount: Rs. {order.discount}
Total: Rs. {order.total}

Shipping Address:
-----------------
{order.full_name}
{order.shipping_address}
{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
{order.shipping_country}
Phone: {order.phone}

Order Status: {order.get_status_display() if hasattr(order, 'get_status_display') else order.status}

We will notify you when your order is shipped.

Thank you for shopping with us!

Best regards,
Furniture Website Team
"""
        
        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.email],
            fail_silently=False,
        )
        
        return True
    except Exception as e:
        print(f"Error sending order confirmation email: {str(e)}")
        return False
