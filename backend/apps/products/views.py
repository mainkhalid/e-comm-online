import csv
import io

from django.http import HttpResponse
from rest_framework import generics, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters
from .models import Category, Brand, Product, ProductImage
from .serializers import (
    CategorySerializer, BrandSerializer, AdminBrandSerializer,
    ProductListSerializer, ProductDetailSerializer,
    AdminProductWriteSerializer,
)


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    in_stock = django_filters.BooleanFilter(method="filter_in_stock")
    on_sale = django_filters.BooleanFilter(method="filter_on_sale")
    category__slug = django_filters.CharFilter(field_name="category__slug", lookup_expr="exact")
    brand__slug = django_filters.CharFilter(field_name="brand__slug", lookup_expr="exact")
    min_rating = django_filters.NumberFilter(method="filter_min_rating")

    class Meta:
        model = Product
        fields = [
            "category", "brand", "is_featured", "is_active",
            "min_price", "max_price", "category__slug", "brand__slug",
        ]

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock_qty__gt=0)
        return queryset

    def filter_on_sale(self, queryset, name, value):
        if value:
            return queryset.filter(sale_price__isnull=False)
        return queryset

    def filter_min_rating(self, queryset, name, value):
        if value:
            from django.db.models import Avg
            return queryset.annotate(avg_rating=Avg("reviews__rating")).filter(avg_rating__gte=value)
        return queryset


class CategoryListView(generics.ListAPIView):
    """Return top-level categories with nested children."""
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)
    queryset = Category.objects.filter(is_active=True, level=0).prefetch_related("children")


class CategoryDetailView(generics.RetrieveAPIView):
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)
    queryset = Category.objects.filter(is_active=True)
    lookup_field = "slug"


class BrandListView(generics.ListAPIView):
    serializer_class = BrandSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = Brand.objects.filter(is_active=True)


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = (permissions.AllowAny,)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "sku", "brand__name", "description", "short_description"]
    ordering_fields = ["price", "created_at", "name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_active=True)
            .select_related("category", "brand")
            .prefetch_related("images")
        )


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_active=True)
            .select_related("category", "brand")
            .prefetch_related("images", "specs", "tags", "reviews", "variants__attributes")
        )


class FeaturedProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_active=True, is_featured=True)
            .select_related("category", "brand")
            .prefetch_related("images")[:12]
        )


# ── Admin views ──────────────────────────────────────────────

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class AdminProductListCreateView(generics.ListCreateAPIView):
    """Admin: list all products (including inactive) and create new ones."""
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "sku", "brand__name"]
    ordering_fields = ["price", "created_at", "name", "stock_qty"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AdminProductWriteSerializer
        return ProductListSerializer

    def get_queryset(self):
        return (
            Product.objects
            .select_related("category", "brand")
            .prefetch_related("images", "variants")
        )


class AdminProductUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: update or delete a product."""
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return AdminProductWriteSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        return (
            Product.objects
            .select_related("category", "brand")
            .prefetch_related("images", "specs", "tags", "variants__attributes")
        )


class AdminCategoryListCreateView(generics.ListCreateAPIView):
    """Admin: list all categories and create new ones."""
    serializer_class = CategorySerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)

    def get_queryset(self):
        return Category.objects.filter(level=0).prefetch_related("children")


class AdminCategoryUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: update or delete a category."""
    serializer_class = CategorySerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    lookup_field = "slug"
    queryset = Category.objects.all()


# ── Brand Admin ──────────────────────────────────────────────

class AdminBrandListCreateView(generics.ListCreateAPIView):
    """Admin: list all brands and create new ones."""
    serializer_class = AdminBrandSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering = ["name"]
    queryset = Brand.objects.all()


class AdminBrandUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: update or delete a brand."""
    serializer_class = AdminBrandSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    lookup_field = "slug"
    queryset = Brand.objects.all()


# ── Bulk Actions ─────────────────────────────────────────────

class AdminProductBulkActionView(APIView):
    """Admin: perform bulk actions on products."""
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)

    def post(self, request):
        action = request.data.get("action")
        ids = request.data.get("ids", [])

        if not ids:
            return Response({"detail": "No product IDs provided."}, status=status.HTTP_400_BAD_REQUEST)

        products = Product.objects.filter(id__in=ids)
        count = products.count()

        if action == "publish":
            products.update(is_active=True)
            return Response({"detail": f"{count} products published."})
        elif action == "unpublish":
            products.update(is_active=False)
            return Response({"detail": f"{count} products unpublished."})
        elif action == "delete":
            products.delete()
            return Response({"detail": f"{count} products deleted."})
        elif action == "feature":
            products.update(is_featured=True)
            return Response({"detail": f"{count} products featured."})
        elif action == "unfeature":
            products.update(is_featured=False)
            return Response({"detail": f"{count} products unfeatured."})
        else:
            return Response({"detail": "Unknown action."}, status=status.HTTP_400_BAD_REQUEST)


# ── CSV Export / Import ──────────────────────────────────────

class AdminProductExportCSV(APIView):
    """Export all products to CSV."""
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)

    def get(self, request):
        products = Product.objects.select_related("category", "brand").all()

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="products.csv"'

        writer = csv.writer(response)
        writer.writerow([
            "ID", "Name", "SKU", "Category", "Brand",
            "Price", "Sale Price", "Stock Qty", "Low Stock Threshold",
            "Is Active", "Is Featured",
            "Short Description", "Meta Title", "Meta Description",
        ])
        for p in products:
            writer.writerow([
                p.id, p.name, p.sku,
                p.category.name if p.category else "",
                p.brand.name if p.brand else "",
                p.price, p.sale_price or "",
                p.stock_qty, p.low_stock_threshold,
                p.is_active, p.is_featured,
                p.short_description, p.meta_title, p.meta_description,
            ])

        return response


class AdminProductImportCSV(APIView):
    """Import products from CSV."""
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    parser_classes = (MultiPartParser,)

    def post(self, request):
        csv_file = request.FILES.get("file")
        if not csv_file:
            return Response({"detail": "No CSV file provided."}, status=status.HTTP_400_BAD_REQUEST)

        decoded = csv_file.read().decode("utf-8")
        reader = csv.DictReader(io.StringIO(decoded))

        created = 0
        updated = 0
        errors = []

        for row_num, row in enumerate(reader, start=2):
            try:
                # Look up category and brand
                category = None
                brand = None
                if row.get("Category"):
                    category = Category.objects.filter(name__iexact=row["Category"].strip()).first()
                if row.get("Brand"):
                    brand = Brand.objects.filter(name__iexact=row["Brand"].strip()).first()

                defaults = {
                    "name": row.get("Name", "").strip(),
                    "category": category,
                    "brand": brand,
                    "price": row.get("Price", 0),
                    "sale_price": row.get("Sale Price") or None,
                    "stock_qty": int(row.get("Stock Qty", 0)),
                    "low_stock_threshold": int(row.get("Low Stock Threshold", 5)),
                    "is_active": row.get("Is Active", "True").strip().lower() in ("true", "1", "yes"),
                    "is_featured": row.get("Is Featured", "False").strip().lower() in ("true", "1", "yes"),
                    "short_description": row.get("Short Description", ""),
                    "meta_title": row.get("Meta Title", ""),
                    "meta_description": row.get("Meta Description", ""),
                }

                sku = row.get("SKU", "").strip()
                if not sku or not defaults["name"]:
                    errors.append(f"Row {row_num}: Missing SKU or Name")
                    continue

                _, was_created = Product.objects.update_or_create(
                    sku=sku, defaults=defaults,
                )
                if was_created:
                    created += 1
                else:
                    updated += 1
            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")

        return Response({
            "created": created,
            "updated": updated,
            "errors": errors,
        })


# ── Admin Image Delete ───────────────────────────────────────

class AdminProductImageDeleteView(generics.DestroyAPIView):
    """Admin: delete a product image."""
    permission_classes = (permissions.IsAuthenticated, IsAdminUser)
    queryset = ProductImage.objects.all()
