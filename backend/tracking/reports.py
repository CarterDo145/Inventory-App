from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear
from django.utils import timezone
from datetime import timedelta

from .models import ItemLedger

@api_view(["GET"])
def most_popular_items_report(request):
    time_frame = request.GET.get("timeFrame", "Weekly")
    limit = int(request.GET.get("limit", 5))

    now = timezone.now()

    if time_frame == "Daily":
        start_date = now - timedelta(days=1)

    elif time_frame == "Weekly":
        start_date = now - timedelta(weeks=1)

    elif time_frame == "Monthly":
        start_date = now - timedelta(days=30)

    elif time_frame == "Yearly":
        start_date = now - timedelta(days=365)

    else:
        start_date = None

    ledger_query = ItemLedger.objects.filter(delta__lt=0)

    if start_date:
        ledger_query = ledger_query.filter(
            occurred_at__gte=start_date
        )

    data = (
        ledger_query
        .values("item__name")
        .annotate(used=Sum("delta"))
        .order_by("used")[:limit]
    )

    result = [
        {
            "name": entry["item__name"],
            "used": abs(entry["used"])
        }
        for entry in data
    ]

    return Response(result)


@api_view(["GET"])
def item_history_report(request):
    time_frame = request.GET.get("timeFrame", "Weekly")

    trunc_map = {
        "Daily": TruncDay,
        "Weekly": TruncWeek,
        "Monthly": TruncMonth,
        "Yearly": TruncYear,
    }

    trunc_function = trunc_map.get(time_frame, TruncWeek)

    data = (
        ItemLedger.objects
        .annotate(period=trunc_function("occurred_at"))
        .values("item__name", "period")
        .annotate(totalDelta=Sum("delta"))
        .order_by("item__name", "period")
    )

    result = {}

    for entry in data:
        item_name = entry["item__name"]

        if item_name not in result:
            result[item_name] = []

        result[item_name].append({
            "period": entry["period"].strftime("%Y-%m-%d"),
            "change": entry["totalDelta"]
        })

    return Response(result)