from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_slug = serializers.CharField(source="product.slug", read_only=True)
    unit_price = serializers.DecimalField(source="product.current_price", max_digits=12, decimal_places=2, read_only=True)
    subtotal = serializers.ReadOnlyField()
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ("id", "product", "product_name", "product_slug", "quantity", "unit_price", "subtotal", "primary_image")

    def get_primary_image(self, obj):
        img = obj.product.images.filter(is_primary=True).first() or obj.product.images.first()
        if img:
            request = self.context.get("request")
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    item_count = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ("id", "items", "total", "item_count")


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ("id", "product_name", "product_sku", "quantity", "unit_price", "subtotal")


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True, default="")

    class Meta:
        model = Order
        fields = (
            "id", "order_number", "user_email", "status", "payment_status",
            "subtotal", "shipping_cost", "total",
            "items", "notes", "created_at",
        )
        read_only_fields = ("order_number", "status", "payment_status", "subtotal", "total")


class AdminOrderSerializer(serializers.ModelSerializer):
    """Serializer for admin order management — allows status updates."""
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True, default="")

    class Meta:
        model = Order
        fields = (
            "id", "order_number", "user_email", "status", "payment_status",
            "subtotal", "shipping_cost", "total",
            "items", "notes", "created_at", "updated_at",
        )
        read_only_fields = ("order_number", "user_email", "payment_status", "subtotal", "total")
