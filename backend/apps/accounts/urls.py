from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, CustomTokenObtainPairView,
    LogoutView, ProfileView, ChangePasswordView,
    AddressListCreateView, AddressDetailView,
)

urlpatterns = [
    path("register/",        RegisterView.as_view(),               name="auth-register"),
    path("login/",           CustomTokenObtainPairView.as_view(),  name="auth-login"),
    path("logout/",          LogoutView.as_view(),                 name="auth-logout"),
    path("token/refresh/",   TokenRefreshView.as_view(),           name="token-refresh"),
    path("profile/",         ProfileView.as_view(),                name="auth-profile"),
    path("change-password/", ChangePasswordView.as_view(),         name="auth-change-password"),
    path("addresses/",       AddressListCreateView.as_view(),      name="address-list"),
    path("addresses/<int:pk>/", AddressDetailView.as_view(),       name="address-detail"),
]