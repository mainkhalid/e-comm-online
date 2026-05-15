from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Admin API views
from apps.accounts.admin_views import (
    AdminDashboardStatsView, AdminCustomerListView,
    AdminReviewListView, AdminReviewApproveView, AdminReviewDeleteView,
    AdminStoreSettingsView,
)
from apps.orders.views import AdminOrderListView, AdminOrderUpdateView
from apps.products.views import (
    AdminProductListCreateView, AdminProductUpdateDeleteView,
    AdminCategoryListCreateView, AdminCategoryUpdateDeleteView,
    AdminBrandListCreateView, AdminBrandUpdateDeleteView,
    AdminProductBulkActionView,
    AdminProductExportCSV, AdminProductImportCSV,
    AdminProductImageDeleteView,
)

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # API v1
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/products/", include("apps.products.urls")),
    path("api/v1/orders/", include("apps.orders.urls")),
    path("api/v1/payments/", include("apps.payments.urls")),
    path("api/v1/reviews/", include("apps.reviews.urls")),

    # Admin API v1
    path("api/v1/admin/stats/", AdminDashboardStatsView.as_view(), name="admin-stats"),
    path("api/v1/admin/customers/", AdminCustomerListView.as_view(), name="admin-customers"),
    path("api/v1/admin/reviews/", AdminReviewListView.as_view(), name="admin-reviews"),
    path("api/v1/admin/reviews/<int:pk>/approve/", AdminReviewApproveView.as_view(), name="admin-review-approve"),
    path("api/v1/admin/reviews/<int:pk>/", AdminReviewDeleteView.as_view(), name="admin-review-delete"),
    path("api/v1/admin/orders/", AdminOrderListView.as_view(), name="admin-orders"),
    path("api/v1/admin/orders/<str:order_number>/", AdminOrderUpdateView.as_view(), name="admin-order-update"),

    # Products admin
    path("api/v1/admin/products/", AdminProductListCreateView.as_view(), name="admin-products"),
    path("api/v1/admin/products/bulk/", AdminProductBulkActionView.as_view(), name="admin-product-bulk"),
    path("api/v1/admin/products/export/", AdminProductExportCSV.as_view(), name="admin-product-export"),
    path("api/v1/admin/products/import/", AdminProductImportCSV.as_view(), name="admin-product-import"),
    path("api/v1/admin/products/<slug:slug>/", AdminProductUpdateDeleteView.as_view(), name="admin-product-detail"),

    # Categories admin
    path("api/v1/admin/categories/", AdminCategoryListCreateView.as_view(), name="admin-categories"),
    path("api/v1/admin/categories/<slug:slug>/", AdminCategoryUpdateDeleteView.as_view(), name="admin-category-detail"),

    # Brands admin
    path("api/v1/admin/brands/", AdminBrandListCreateView.as_view(), name="admin-brands"),
    path("api/v1/admin/brands/<slug:slug>/", AdminBrandUpdateDeleteView.as_view(), name="admin-brand-detail"),

    # Settings admin
    path("api/v1/admin/settings/", AdminStoreSettingsView.as_view(), name="admin-settings"),

    # Images admin
    path("api/v1/admin/images/<int:pk>/", AdminProductImageDeleteView.as_view(), name="admin-image-delete"),

    # API Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

    # Sitemaps
    path("", include("apps.seo.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
