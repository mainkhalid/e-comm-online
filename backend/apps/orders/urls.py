from django.urls import path
from .views import CartView, OrderListCreateView, OrderDetailView

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("", OrderListCreateView.as_view(), name="order-list"),
    path("<str:order_number>/", OrderDetailView.as_view(), name="order-detail"),
]
