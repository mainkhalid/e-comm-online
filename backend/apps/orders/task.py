"""
apps/orders/tasks.py
Celery tasks for order and payment email notifications.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_order_confirmation_email(self, order_id):
    """Send order confirmation email to customer."""
    try:
        from apps.orders.models import Order
        order = Order.objects.select_related("user", "shipping_address").prefetch_related("items").get(id=order_id)

        subject = f"Order Confirmed — {order.order_number} | TechZone"
        message = render_to_string("emails/order_confirmation.txt", {"order": order})
        html_message = render_to_string("emails/order_confirmation.html", {"order": order})

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_payment_receipt_email(self, payment_id):
    """Send M-Pesa payment receipt email to customer."""
    try:
        from apps.payments.models import Payment
        payment = Payment.objects.select_related("order__user", "order__shipping_address").get(id=payment_id)
        order = payment.order

        subject = f"Payment Received — {order.order_number} | TechZone"
        message = render_to_string("emails/payment_receipt.txt", {"payment": payment, "order": order})
        html_message = render_to_string("emails/payment_receipt.html", {"payment": payment, "order": order})

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_low_stock_alert_email(self, product_id):
    """Send low stock alert to admin."""
    try:
        from apps.products.models import Product
        from apps.accounts.models import StoreSettings
        product = Product.objects.get(id=product_id)
        store = StoreSettings.load()

        subject = f"Low Stock Alert — {product.name} | TechZone"
        message = (
            f"Product '{product.name}' (SKU: {product.sku}) "
            f"is running low. Only {product.stock_qty} units left."
        )

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[store.store_email],
            fail_silently=False,
        )
    except Exception as exc:
        raise self.retry(exc=exc)