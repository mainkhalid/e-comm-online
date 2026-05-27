from django.core.cache import cache

# ── Cache TTLs ────────────────────────────────────────────────
STORE_SETTINGS_TTL = 60 * 10        # 10 minutes
CATEGORIES_TTL     = 60 * 60        # 1 hour
BRANDS_TTL         = 60 * 60        # 1 hour
DASHBOARD_TTL      = 60 * 5         # 5 minutes
PRODUCT_LIST_TTL   = 60 * 10        # 10 minutes
FEATURED_TTL       = 60 * 10        # 10 minutes

# ── Cache keys ────────────────────────────────────────────────
STORE_SETTINGS_KEY = "tz:store_settings"
CATEGORIES_KEY     = "tz:categories"
BRANDS_KEY         = "tz:brands"
DASHBOARD_KEY      = "tz:dashboard_stats"
FEATURED_KEY       = "tz:featured_products"


def product_list_key(params: str) -> str:
    """Unique key per query string so different filters don't collide."""
    return f"tz:products:{params}"


# ── Invalidation helpers ──────────────────────────────────────

def invalidate_store_settings():
    """Call after saving StoreSettings."""
    cache.delete(STORE_SETTINGS_KEY)
    cache.delete("tz:mpesa_config")
    cache.delete("tz:mpesa_access_token")


def invalidate_categories():
    """Call after saving/deleting a Category."""
    cache.delete(CATEGORIES_KEY)


def invalidate_brands():
    """Call after saving/deleting a Brand."""
    cache.delete(BRANDS_KEY)


def invalidate_dashboard():
    """Call after any order/product change that affects stats."""
    cache.delete(DASHBOARD_KEY)


def invalidate_product_cache():
    """
    Call after saving/deleting a Product.
    Uses cache pattern delete to wipe all product list keys.
    """
    try:
        cache.delete_pattern("tz:products:*")
    except AttributeError:
        # Fallback for non-redis backends (e.g. DummyCache in tests)
        pass
    cache.delete(FEATURED_KEY)
    invalidate_dashboard()