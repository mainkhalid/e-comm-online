from django.urls import path
from .views import InitiateMpesaPaymentView, MpesaCallbackView, CheckPaymentStatusView

urlpatterns = [
    path("mpesa/initiate/", InitiateMpesaPaymentView.as_view(), name="mpesa-initiate"),
    path("mpesa/callback/", MpesaCallbackView.as_view(), name="mpesa-callback"),
    path("status/<str:order_number>/", CheckPaymentStatusView.as_view(), name="payment-status"),
]
