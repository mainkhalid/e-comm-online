from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("order", "amount", "status", "mpesa_receipt_number", "created_at")
    list_filter = ("status",)
    readonly_fields = ("merchant_request_id", "checkout_request_id", "mpesa_receipt_number")
