from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, ProductSpec, Tag


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description", "image", "meta_title", "meta_description", "children")

    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name", "slug", "logo", "description")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "is_primary", "order")


class ProductSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpec
        fields = ("id", "label", "value", "order")


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name", "slug")


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product listings / search results."""
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source="category.name", read_only=True)
    brand_name = serializers.CharField(source="brand.name", read_only=True)
    current_price = serializers.ReadOnlyField()
    discount_percent = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug", "sku",
            "category_name", "brand_name",
            "price", "sale_price", "current_price", "discount_percent",
            "in_stock", "is_featured",
            "average_rating", "review_count",
            "primary_image",
            "meta_title", "meta_description",
        )

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get("request")
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for the product detail page."""
    images = ProductImageSerializer(many=True, read_only=True)
    specs = ProductSpecSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    current_price = serializers.ReadOnlyField()
    discount_percent = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

    # SEO / structured data fields
    schema_json_ld = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug", "sku",
            "category", "brand", "tags",
            "short_description", "description",
            "price", "sale_price", "current_price", "discount_percent",
            "stock_qty", "in_stock", "is_low_stock",
            "is_featured",
            "images", "specs",
            "average_rating", "review_count",
            "meta_title", "meta_description", "canonical_url",
            "schema_json_ld",
            "created_at", "updated_at",
        )

    def get_schema_json_ld(self, obj):
        """Generate Schema.org Product JSON-LD for SEO."""
        request = self.context.get("request")
        primary_img = obj.images.filter(is_primary=True).first()
        image_url = request.build_absolute_uri(primary_img.image.url) if (primary_img and request) else ""

        return {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": obj.name,
            "description": obj.short_description,
            "sku": obj.sku,
            "brand": {"@type": "Brand", "name": obj.brand.name if obj.brand else ""},
            "image": image_url,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "KES",
                "price": str(obj.current_price),
                "availability": "https://schema.org/InStock" if obj.in_stock else "https://schema.org/OutOfStock",
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": str(obj.average_rating),
                "reviewCount": str(obj.review_count),
            } if obj.review_count > 0 else None,
        }
