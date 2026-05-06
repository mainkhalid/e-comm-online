from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from rest_framework import serializers

from apps.accounts.models import User
from apps.accounts.serializers import UserSerializer
from apps.orders.models import Order
from apps.products.models import Product, Category
from apps.reviews.models import Review


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class AdminDashboardStatsView(APIView):
    """Return aggregate stats for the admin dashboard."""
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)

    def get(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        total_orders = Order.objects.count()
        total_revenue = Order.objects.filter(
            payment_status="paid"
        ).aggregate(total=Sum("total"))["total"] or 0

        recent_orders = Order.objects.filter(created_at__gte=thirty_days_ago).count()
        recent_revenue = Order.objects.filter(
            payment_status="paid", created_at__gte=thirty_days_ago
        ).aggregate(total=Sum("total"))["total"] or 0

        total_products = Product.objects.filter(is_active=True).count()
        total_customers = User.objects.filter(is_staff=False, is_active=True).count()
        low_stock = Product.objects.filter(
            is_active=True, stock_qty__gt=0, stock_qty__lte=5
        ).count()
        out_of_stock = Product.objects.filter(is_active=True, stock_qty=0).count()

        pending_orders = Order.objects.filter(status="pending").count()
        pending_reviews = Review.objects.filter(is_approved=False).count()

        # Order status breakdown
        status_breakdown = dict(
            Order.objects.values_list("status")
            .annotate(count=Count("id"))
            .values_list("status", "count")
        )

        return Response({
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "recent_orders": recent_orders,
            "recent_revenue": float(recent_revenue),
            "total_products": total_products,
            "total_customers": total_customers,
            "low_stock_count": low_stock,
            "out_of_stock_count": out_of_stock,
            "pending_orders": pending_orders,
            "pending_reviews": pending_reviews,
            "status_breakdown": status_breakdown,
        })


class AdminCustomerSerializer(UserSerializer):
    order_count = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ("order_count", "total_spent", "is_active")


# Need serializers import
from rest_framework import serializers


class AdminCustomerListView(generics.ListAPIView):
    """Paginated list of customers for admin panel."""
    serializer_class = AdminCustomerSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    search_fields = ["email", "first_name", "last_name", "phone"]

    def get_queryset(self):
        return (
            User.objects.filter(is_staff=False)
            .annotate(
                order_count=Count("orders"),
                total_spent=Sum("orders__total", filter=Q(orders__payment_status="paid")),
            )
            .order_by("-date_joined")
        )


class AdminReviewListView(generics.ListAPIView):
    """List all reviews for admin moderation."""
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)

    def get_serializer_class(self):
        from apps.reviews.views import ReviewSerializer
        return ReviewSerializer

    def get_queryset(self):
        return Review.objects.select_related("product", "user").order_by("-created_at")


class AdminReviewApproveView(APIView):
    """Approve or reject a review."""
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)

    def patch(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return Response({"error": "Review not found."}, status=status.HTTP_404_NOT_FOUND)

        is_approved = request.data.get("is_approved")
        if is_approved is not None:
            review.is_approved = is_approved
            review.save()
        return Response({"message": "Review updated.", "is_approved": review.is_approved})


class AdminReviewDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    queryset = Review.objects.all()
