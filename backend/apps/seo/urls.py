from django.contrib.sitemaps import Sitemap
from django.urls import path
from django.contrib.sitemaps.views import sitemap
from apps.products.models import Product, Category


class ProductSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9

    def items(self):
        return Product.objects.filter(is_active=True)

    def location(self, obj):
        return f"/products/{obj.slug}/"

    def lastmod(self, obj):
        return obj.updated_at


class CategorySitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.7

    def items(self):
        return Category.objects.filter(is_active=True)

    def location(self, obj):
        return f"/category/{obj.slug}/"


sitemaps = {
    "products": ProductSitemap,
    "categories": CategorySitemap,
}

urlpatterns = [
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="django.contrib.sitemaps.views.sitemap"),
]
