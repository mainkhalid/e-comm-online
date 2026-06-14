from django.urls import path
from .views import (
    CategoryListView, CategoryDetailView,
    BrandListView,
    ProductListView, ProductDetailView, FeaturedProductsView,
)

urlpatterns = [
    path("", ProductListView.as_view(), name="product-list"),
    path("featured/", FeaturedProductsView.as_view(), name="product-featured"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("categories/<slug:slug>/", CategoryDetailView.as_view(), name="category-detail"),
    path("brands/", BrandListView.as_view(), name="brand-list"),

    path("<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
]