from rest_framework import serializers
from .models import (
    Category, Brand, Product, ProductImage,
    ProductSpec, Tag, ProductVariant, VariantAttribute,
)


class DynamicFieldsMixin:
    """Allow clients to request only specific fields via ?fields=name,price,image."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request:
            fields_param = request.query_params.get('fields')
            if fields_param:
                allowed = set(fields_param.split(','))
                existing = set(self.fields.keys())
                for field_name in existing - allowed:
                    self.fields.pop(field_name)


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description", "image", "meta_title", "meta_description", "is_active", "children")

    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name", "slug", "logo", "description")


class AdminBrandSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ("id", "name", "slug", "logo", "description", "is_active", "product_count")

    def get_product_count(self, obj):
        # Use annotated value from queryset if available, else fallback
        if hasattr(obj, 'product_count'):
            return obj.product_count
        return obj.products.filter(is_active=True).count()


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


class VariantAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariantAttribute
        fields = ("id", "attribute_name", "attribute_value")


class ProductVariantSerializer(serializers.ModelSerializer):
    attributes = VariantAttributeSerializer(many=True, read_only=True)
    effective_price = serializers.ReadOnlyField()

    class Meta:
        model = ProductVariant
        fields = (
            "id", "name", "sku", "price_override",
            "stock_qty", "is_active", "order",
            "attributes", "effective_price",
        )


class ProductListSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    """Lightweight serializer for product listings / search results."""
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source="category.name", read_only=True)
    brand_name = serializers.CharField(source="brand.name", read_only=True)
    current_price = serializers.ReadOnlyField()
    discount_percent = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    variant_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug", "sku",
            "category", "category_name", "brand", "brand_name",
            "price", "sale_price", "current_price", "discount_percent",
            "stock_qty", "in_stock", "is_featured", "is_active",
            "average_rating", "review_count",
            "primary_image", "variant_count",
            "meta_title", "meta_description",
            "created_at", "updated_at",
        )

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get("request")
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None

    def get_variant_count(self, obj):
        if hasattr(obj, '_variant_count'):
            return obj._variant_count
        return obj.variants.count()


class ProductDetailSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    """Full serializer for the product detail page."""
    images = ProductImageSerializer(many=True, read_only=True)
    specs = ProductSpecSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
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
            "stock_qty", "low_stock_threshold", "in_stock", "is_low_stock",
            "is_featured", "is_active",
            "images", "specs", "variants",
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

        canonical = obj.canonical_url or f"https://www.nixxontechnologies.co.ke/products/{obj.slug}/"

        schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": obj.name,
            "description": obj.short_description or obj.meta_description,
            "sku": obj.sku,
            "url": canonical,
            "brand": {
                "@type": "Brand",
                "name": obj.brand.name if obj.brand else "Nixxon Technologies",
            },
            "image": image_url,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "KES",
                "price": str(obj.current_price),
                "availability": "https://schema.org/InStock" if obj.in_stock else "https://schema.org/OutOfStock",
                "url": canonical,
                "seller": {
                    "@type": "Organization",
                    "name": "Nixxon Technologies",
                    "url": "https://www.nixxontechnologies.co.ke",
                },
            },
        }

        if obj.review_count > 0:
            schema["aggregateRating"] = {
                "@type": "AggregateRating",
                "ratingValue": str(obj.average_rating),
                "reviewCount": str(obj.review_count),
            }

        return schema


class AdminProductWriteSerializer(serializers.ModelSerializer):
    """
    Admin write serializer – handles create/update with nested specs, variants, images.
    Accepts JSON body or multipart/form-data with uploaded_images files.
    """
    specs = serializers.JSONField(required=False, default=list)
    variants = serializers.JSONField(required=False, default=list)
    tag_names = serializers.ListField(child=serializers.CharField(), required=False, default=list)

    class Meta:
        model = Product
        fields = (
            "name", "sku", "category", "brand",
            "short_description", "description",
            "price", "sale_price",
            "stock_qty", "low_stock_threshold",
            "is_active", "is_featured",
            "meta_title", "meta_description", "canonical_url",
            "specs", "variants", "tag_names",
        )

    def create(self, validated_data):
        specs_data = validated_data.pop("specs", [])
        variants_data = validated_data.pop("variants", [])
        tag_names = validated_data.pop("tag_names", [])

        product = Product.objects.create(**validated_data)

        # Handle uploaded images
        request = self.context.get("request")
        if request:
            images = request.FILES.getlist("uploaded_images")
            for idx, img in enumerate(images):
                ProductImage.objects.create(
                    product=product, image=img,
                    is_primary=(idx == 0), order=idx,
                )

        # Specs
        for idx, spec in enumerate(specs_data):
            ProductSpec.objects.create(
                product=product,
                label=spec.get("label", ""),
                value=spec.get("value", ""),
                order=spec.get("order", idx),
            )

        # Variants
        for idx, var in enumerate(variants_data):
            variant = ProductVariant.objects.create(
                product=product,
                name=var.get("name", ""),
                sku=var.get("sku", ""),
                price_override=var.get("price_override") or None,
                stock_qty=var.get("stock_qty", 0),
                is_active=var.get("is_active", True),
                order=var.get("order", idx),
            )
            for attr in var.get("attributes", []):
                VariantAttribute.objects.create(
                    variant=variant,
                    attribute_name=attr.get("attribute_name", ""),
                    attribute_value=attr.get("attribute_value", ""),
                )

        # Tags
        for name in tag_names:
            tag, _ = Tag.objects.get_or_create(
                name=name.strip(),
                defaults={"slug": name.strip().lower().replace(" ", "-")},
            )
            tag.products.add(product)

        return product

    def update(self, instance, validated_data):
        specs_data = validated_data.pop("specs", None)
        variants_data = validated_data.pop("variants", None)
        tag_names = validated_data.pop("tag_names", None)

        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle uploaded images
        request = self.context.get("request")
        if request:
            images = request.FILES.getlist("uploaded_images")
            existing_count = instance.images.count()
            for idx, img in enumerate(images):
                ProductImage.objects.create(
                    product=instance, image=img,
                    is_primary=(existing_count == 0 and idx == 0),
                    order=existing_count + idx,
                )

        # Specs
        if specs_data is not None:
            instance.specs.all().delete()
            for idx, spec in enumerate(specs_data):
                ProductSpec.objects.create(
                    product=instance,
                    label=spec.get("label", ""),
                    value=spec.get("value", ""),
                    order=spec.get("order", idx),
                )

        # Variants
        if variants_data is not None:
            instance.variants.all().delete()
            for idx, var in enumerate(variants_data):
                variant = ProductVariant.objects.create(
                    product=instance,
                    name=var.get("name", ""),
                    sku=var.get("sku", ""),
                    price_override=var.get("price_override") or None,
                    stock_qty=var.get("stock_qty", 0),
                    is_active=var.get("is_active", True),
                    order=var.get("order", idx),
                )
                for attr in var.get("attributes", []):
                    VariantAttribute.objects.create(
                        variant=variant,
                        attribute_name=attr.get("attribute_name", ""),
                        attribute_value=attr.get("attribute_value", ""),
                    )

        # Tags
        if tag_names is not None:
            instance.tags.clear()
            for name in tag_names:
                tag, _ = Tag.objects.get_or_create(
                    name=name.strip(),
                    defaults={"slug": name.strip().lower().replace(" ", "-")},
                )
                tag.products.add(instance)

        return instance

    def to_representation(self, instance):
        """Serialize the product for response after create/update."""
        data = {
            "name": instance.name,
            "slug": instance.slug,
            "sku": instance.sku,
            "category": instance.category_id,
            "brand": instance.brand_id,
            "short_description": instance.short_description,
            "description": instance.description,
            "price": str(instance.price),
            "sale_price": str(instance.sale_price) if instance.sale_price else None,
            "stock_qty": instance.stock_qty,
            "low_stock_threshold": instance.low_stock_threshold,
            "is_active": instance.is_active,
            "is_featured": instance.is_featured,
            "meta_title": instance.meta_title,
            "meta_description": instance.meta_description,
            "canonical_url": instance.canonical_url,
            "specs": list(instance.specs.values("label", "value", "order")),
            "variants": [
                {
                    "id": v.id, "name": v.name, "sku": v.sku,
                    "price_override": str(v.price_override) if v.price_override else None,
                    "stock_qty": v.stock_qty, "is_active": v.is_active, "order": v.order,
                    "attributes": list(v.attributes.values("attribute_name", "attribute_value")),
                }
                for v in instance.variants.all()
            ],
            "tag_names": list(instance.tags.values_list("name", flat=True)),
        }
        return data