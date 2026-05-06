from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from .models import Category, Brand, Product, ProductImage, ProductSpec, Tag


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductSpecInline(admin.TabularInline):
    model = ProductSpec
    extra = 3


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "sku", "category", "brand", "price", "sale_price", "stock_qty", "is_active", "is_featured")
    list_filter = ("is_active", "is_featured", "category", "brand")
    search_fields = ("name", "sku", "meta_title")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductSpecInline]


@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}

admin.site.register(Tag)
