from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class Address(models.Model):
    ADDRESS_TYPES = [("shipping", "Shipping"), ("billing", "Billing")]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPES, default="shipping")
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    county = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "addresses"

    def __str__(self):
        return f"{self.full_name} — {self.city}"


class StoreSettings(models.Model):
    """
    Singleton model for store-wide configuration.
    Use StoreSettings.load() to get/create the single instance.
    """

    # ── General ──────────────────────────────────────────────
    store_name = models.CharField(max_length=200, default="Nixxon Technologies")
    store_tagline = models.CharField(max_length=300, blank=True, default="Computers, Laptops & Accessories")
    store_email = models.EmailField(blank=True, default="info@nixxon technologies.co.ke")
    store_phone = models.CharField(max_length=20, blank=True, default="+254 700 000 000")
    address_line = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True, default="Nairobi")
    country = models.CharField(max_length=100, blank=True, default="Kenya")
    currency_code = models.CharField(max_length=5, default="KES")
    currency_symbol = models.CharField(max_length=5, default="KSh")
    logo = models.ImageField(upload_to="Nixxon/settings/", blank=True, null=True)
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    maintenance_mode = models.BooleanField(default=False)

    # ── Payments — M-Pesa ────────────────────────────────────
    mpesa_enabled = models.BooleanField(default=True)
    mpesa_environment = models.CharField(
        max_length=20, default="sandbox",
        choices=[("sandbox", "Sandbox (Testing)"), ("production", "Production (Live)")],
    )
    mpesa_consumer_key = models.CharField(max_length=200, blank=True)
    mpesa_consumer_secret = models.CharField(max_length=200, blank=True)
    mpesa_shortcode = models.CharField(max_length=20, blank=True)
    mpesa_passkey = models.CharField(max_length=200, blank=True)
    mpesa_callback_url = models.URLField(blank=True)

    # ── Shipping & Tax ───────────────────────────────────────
    default_shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=300)
    free_shipping_threshold = models.DecimalField(
        max_digits=10, decimal_places=2, default=10000,
        help_text="Orders above this amount get free shipping. Set 0 to disable.",
    )
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=16.00, help_text="VAT percentage")
    tax_inclusive = models.BooleanField(default=True, help_text="If True, displayed prices already include tax")

    # ── Timestamps ───────────────────────────────────────────
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Store Settings"
        verbose_name_plural = "Store Settings"

    def __str__(self):
        return f"{self.store_name} Settings"

    def save(self, *args, **kwargs):
        # Enforce singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        """Get or create the singleton settings instance."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
