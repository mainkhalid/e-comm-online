from rest_framework import serializers, generics, permissions
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = Review
        fields = ("id", "product", "user_name", "rating", "title", "body", "created_at")
        read_only_fields = ("id", "user_name", "is_approved", "created_at")


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        product_slug = self.kwargs.get("product_slug")
        return Review.objects.filter(product__slug=product_slug, is_approved=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
