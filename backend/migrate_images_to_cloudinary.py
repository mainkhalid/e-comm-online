"""
migrate_images_to_cloudinary.py
One-time script to upload existing local media files to Cloudinary.

Run with:
    python manage.py shell < migrate_images_to_cloudinary.py

Or copy/paste into the Django shell:
    python manage.py shell
"""
import os
import cloudinary.uploader
from apps.products.models import ProductImage, Category, Brand
from apps.accounts.models import StoreSettings

SUCCESS = 0
FAILED  = 0


def migrate(instance, field_name, folder):
    global SUCCESS, FAILED
    field = getattr(instance, field_name)
    if not field:
        return
    url = field.url if hasattr(field, 'url') else str(field)
    # Skip if already a Cloudinary URL
    if 'res.cloudinary.com' in url:
        print(f"  SKIP (already Cloudinary): {url}")
        return
    try:
        local_path = field.path
        if not os.path.exists(local_path):
            print(f"  SKIP (file not found): {local_path}")
            return
        result = cloudinary.uploader.upload(
            local_path,
            folder=folder,
            use_filename=True,
            unique_filename=True,
        )
        setattr(instance, field_name, result["public_id"])
        instance.save(update_fields=[field_name])
        print(f"  OK: {local_path} → {result['secure_url']}")
        SUCCESS += 1
    except Exception as e:
        print(f"  FAILED: {e}")
        FAILED += 1


print("=== Migrating ProductImages ===")
for img in ProductImage.objects.all():
    print(f"ProductImage {img.id} ({img.product.name})")
    migrate(img, "image", "techzone/products")

print("\n=== Migrating Category Images ===")
for cat in Category.objects.exclude(image="").exclude(image=None):
    print(f"Category {cat.id} ({cat.name})")
    migrate(cat, "image", "techzone/categories")

print("\n=== Migrating Brand Logos ===")
for brand in Brand.objects.exclude(logo="").exclude(logo=None):
    print(f"Brand {brand.id} ({brand.name})")
    migrate(brand, "logo", "techzone/brands")

print("\n=== Migrating Store Logo ===")
s = StoreSettings.load()
if s.logo:
    migrate(s, "logo", "techzone/settings")

print(f"\n=== Done: {SUCCESS} migrated, {FAILED} failed ===")