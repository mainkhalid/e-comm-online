from django.db import models
from django.utils.text import slugify
from mptt.models import MPTTModel, TreeForeignKey


class Category(MPTTModel):
    """Nested product categories using MPTT (e.g. Computers > Laptops > Gaming Laptops)."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    parent = TreeForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL, related_name="children")
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="techzone/categories/", blank=True, null=True)
    is_active = models.BooleanField(default=True)

    # SEO fields
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)

    class MPTTMeta:
        order_insertion_by = ["name"]

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Brand(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to="techzone/brands/", blank=True, null=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    # Core fields
    name = models.CharField(max_length=300)
    slug = models.SlugField(unique=True, max_length=300)
    sku = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name="products")

    # Descriptions
    short_description = models.TextField(max_length=500, blank=True)
    description = models.TextField(blank=True)

    # Pricing
    price = models.DecimalField(max_digits=12, decimal_places=2)
    sale_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    # Inventory
    stock_qty = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=5)

    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    # SEO fields — critical for CPO/SEO
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    canonical_url = models.URLField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["sku"]),
            models.Index(fields=["is_active", "is_featured"]),
            models.Index(fields=["brand", "is_active"]),
            models.Index(fields=["category", "is_active"]),
            models.Index(fields=["-created_at"]),
            models.Index(fields=["price"]),
            models.Index(fields=["is_featured", "-created_at"]),
        ]

    def __str__(self):
        return self.name

    @property
    def current_price(self):
        return self.sale_price if self.sale_price else self.price

    @property
    def discount_percent(self):
        if self.sale_price and self.price:
            return int(((self.price - self.sale_price) / self.price) * 100)
        return 0

    @property
    def in_stock(self):
        return self.stock_qty > 0

    @property
    def is_low_stock(self):
        return 0 < self.stock_qty <= self.low_stock_threshold

    @property
    def average_rating(self):
        from django.db.models import Avg
        result = self.reviews.filter(
            is_approved=True
        ).aggregate(avg=Avg('rating'))
        return round(result['avg'] or 0, 1)

    @property
    def review_count(self):
        from django.db.models import Count
        result = self.reviews.filter(
            is_approved=True
        ).aggregate(cnt=Count('id'))
        return result['cnt']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        # Auto-generate meta title if not set
        if not self.meta_title:
            self.meta_title = f"{self.name[:60]} | TechZone"
        # Auto-generate meta description if not set
        if not self.meta_description and self.short_description:
            self.meta_description = self.short_description[:160]
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="techzone/products/")
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.name} — image {self.order}"


class ProductSpec(models.Model):
    """Key-value specification pairs for a product (e.g. RAM: 16GB, Storage: 512GB SSD)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="specs")
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.label}: {self.value}"


class ProductVariant(models.Model):
    """Product variants (e.g., 16GB/512GB/Black for a laptop, 3m USB-C for a cable)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    name = models.CharField(max_length=200, help_text="e.g. '16GB RAM / 512GB SSD / Space Gray'")
    sku = models.CharField(max_length=50, unique=True)
    price_override = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True,
                                         help_text="Leave blank to use the parent product price")
    stock_qty = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.name} — {self.name}"

    @property
    def effective_price(self):
        return self.price_override if self.price_override else self.product.price


class VariantAttribute(models.Model):
    """Key-value attributes for a variant (e.g., RAM: 16GB, Color: Space Gray)."""
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name="attributes")
    attribute_name = models.CharField(max_length=100)
    attribute_value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.attribute_name}: {self.attribute_value}"


class Tag(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    products = models.ManyToManyField(Product, related_name="tags", blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)