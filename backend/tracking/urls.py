from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemLedgerViewSet, ItemViewSet
from .reports import total_stock_report, most_popular_items_report


router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='items')
router.register(r'ledger', ItemLedgerViewSet, basename='ledger')

urlpatterns = [
    path('', include(router.urls)),
    path("reports/total-stock/", total_stock_report),
    path("reports/most-popular-items/", most_popular_items_report),
]