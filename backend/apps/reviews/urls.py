from django.urls import path
from .views import ReviewListCreateView

urlpatterns = [
    path("<slug:product_slug>/", ReviewListCreateView.as_view(), name="review-list"),
]
