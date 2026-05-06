from rest_framework import generics, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, AdminOrderSerializer
from apps.products.models import Product


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class CartView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self.get_cart(request.user)
        return Response(CartSerializer(cart, context={"request": request}).data)

    def post(self, request):
        """Add or update item in cart."""
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        cart = self.get_cart(request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()

        return Response(CartSerializer(cart, context={"request": request}).data)

    def delete(self, request):
        """Remove item from cart."""
        item_id = request.data.get("item_id")
        cart = self.get_cart(request.user)
        CartItem.objects.filter(id=item_id, cart=cart).delete()
        return Response(CartSerializer(cart, context={"request": request}).data)


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")

    def perform_create(self, serializer):
        cart = Cart.objects.filter(user=self.request.user).first()
        if not cart or not cart.items.exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Cart is empty.")
        subtotal = cart.total
        order = serializer.save(user=self.request.user, subtotal=subtotal, total=subtotal)
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_sku=item.product.sku,
                quantity=item.quantity,
                unit_price=item.product.current_price,
            )
        cart.items.all().delete()


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = "order_number"

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


# ── Admin views ──────────────────────────────────────────────

class AdminOrderListView(generics.ListAPIView):
    """All orders for admin panel with search and filtering."""
    serializer_class = AdminOrderSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "payment_status"]
    search_fields = ["order_number", "user__email", "user__first_name"]
    ordering_fields = ["created_at", "total"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Order.objects.select_related("user").prefetch_related("items").all()


class AdminOrderUpdateView(generics.UpdateAPIView):
    """Update order status (admin only)."""
    serializer_class = AdminOrderSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    lookup_field = "order_number"
    queryset = Order.objects.all()
