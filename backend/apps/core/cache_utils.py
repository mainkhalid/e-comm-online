from django.core.cache import cache

# ── Cache TTLs ────────────────────────────────────────────────
STORE_SETTINGS_TTL = 60 * 10        # 10 minutes
CATEGORIES_TTL     = 60 * 60        # 1 hour
BRANDS_TTL         = 60 * 60        # 1 hour
DASHBOARD_TTL      = 60 * 5         # 5 minutes
PRODUCT_LIST_TTL   = 60 * 10        # 10 minutes
FEATURED_TTL       = 60 * 10        # 10 minutes
PRODUCT_SEARCH_TTL = 60 * 5         # 5 minutes — search result cache

# ── Cache keys ────────────────────────────────────────────────
STORE_SETTINGS_KEY = "tz:store_settings"
CATEGORIES_KEY     = "tz:categories"
BRANDS_KEY         = "tz:brands"
DASHBOARD_KEY      = "tz:dashboard_stats"
FEATURED_KEY       = "tz:featured_products"


def product_list_key(params: str) -> str:
    """Unique key per query string so different filters don't collide."""
    return f"tz:products:{params}"


def product_search_key(query_string: str) -> str:
    """Cache key for search results based on full query string."""
    return f"tz:search:{query_string}"




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


def invalidate_product_cache(product_id=None, brand_id=None, category_id=None):
    """
    Selective cache invalidation.
    If specific IDs are given, only invalidate related keys.
    Falls back to full invalidation when no IDs provided.
    """
    keys_to_delete = []

    if product_id:
        keys_to_delete.append(f"tz:product:{product_id}")
    if brand_id:
        keys_to_delete.append(f"tz:products:brand:{brand_id}")
    if category_id:
        keys_to_delete.append(f"tz:products:category:{category_id}")

    if keys_to_delete:
        cache.delete_many(keys_to_delete)
    else:
        # Full invalidation fallback — wipe all product list caches
        try:
            cache.delete_pattern("tz:products:*")
        except AttributeError:
            pass
        try:
            cache.delete_pattern("tz:search:*")
        except AttributeError:
            pass

    # Always invalidate featured + dashboard on any product change
    cache.delete(FEATURED_KEY)
    invalidate_dashboard()