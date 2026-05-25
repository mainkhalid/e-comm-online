import re
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.orders.models import Order
from .models import Payment
from .mpesa import stk_push, query_stk_push


def format_phone(phone: str) -> str:
    """
    Normalize phone number to 254XXXXXXXXX format.
    Raises ValueError for invalid Kenyan numbers.
    """
    phone = re.sub(r"\D", "", phone)
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    elif phone.startswith("+"):
        phone = phone[1:]

    # Must be a valid Safaricom (07xx) or Airtel/Faiba (01xx) Kenya number
    if not re.match(r"^2547\d{8}$|^2541\d{8}$", phone):
        raise ValueError(
            f"'{phone}' is not a valid Kenyan mobile number. "
            "Use format 07XXXXXXXX or 01XXXXXXXX."
        )
    return phone


class InitiateMpesaPaymentView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        order_number = request.data.get("order_number")
        phone = request.data.get("phone_number")

        if not order_number or not phone:
            return Response(
                {"error": "order_number and phone_number are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.payment_status == "paid":
            return Response({"error": "Order is already paid."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate and format phone number
        try:
            formatted_phone = format_phone(phone)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Safely cast order total to int
        try:
            amount = int(order.total)
        except (TypeError, ValueError):
            return Response(
                {"error": "Order total is invalid. Please contact support."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = stk_push(formatted_phone, amount, order.order_number)
        except Exception as e:
            return Response({"error": f"M-Pesa request failed: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)

        # Save or update payment record
        Payment.objects.update_or_create(
            order=order,
            defaults={
                "phone_number": formatted_phone,
                "amount": order.total,
                "merchant_request_id": result.get("MerchantRequestID", ""),
                "checkout_request_id": result.get("CheckoutRequestID", ""),
                "status": "pending",
            },
        )

        return Response({
            "message": "STK push sent. Please check your phone.",
            "checkout_request_id": result.get("CheckoutRequestID"),
        })


class MpesaCallbackView(APIView):
    """Endpoint Safaricom calls after payment. Must be publicly accessible."""
    permission_classes = (AllowAny,)

    def post(self, request):
        # Validate basic payload structure before doing anything
        body = request.data.get("Body")
        if not body or "stkCallback" not in body:
            return Response({"ResultCode": 0, "ResultDesc": "Success"})

        data = body["stkCallback"]
        checkout_request_id = data.get("CheckoutRequestID")
        result_code = str(data.get("ResultCode", ""))
        result_desc = data.get("ResultDesc", "")

        if not checkout_request_id:
            return Response({"ResultCode": 0, "ResultDesc": "Success"})

        try:
            payment = Payment.objects.get(checkout_request_id=checkout_request_id)
        except Payment.DoesNotExist:
            return Response({"ResultCode": 0, "ResultDesc": "Success"})

        payment.result_code = result_code
        payment.result_description = result_desc

        if result_code == "0":
            # Extract M-Pesa receipt number from callback metadata
            items = data.get("CallbackMetadata", {}).get("Item", [])
            for item in items:
                if item.get("Name") == "MpesaReceiptNumber":
                    payment.mpesa_receipt_number = item.get("Value", "")
            payment.status = "completed"
            payment.order.payment_status = "paid"
            payment.order.status = "confirmed"
            payment.order.save()
        else:
            payment.status = "failed"

        payment.save()
        return Response({"ResultCode": 0, "ResultDesc": "Success"})


class CheckPaymentStatusView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, order_number):
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
            payment = order.payment
        except (Order.DoesNotExist, Payment.DoesNotExist):
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "order_number": order.order_number,
            "payment_status": order.payment_status,   # "unpaid" | "paid" | "failed"
            "mpesa_receipt": payment.mpesa_receipt_number,
            "status": payment.status,                  # "pending" | "completed" | "failed"
        })