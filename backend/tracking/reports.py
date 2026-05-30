from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear
from django.utils import timezone
from datetime import timedelta

from .models import Item, ItemLedger


@api_view(["GET"])
def total_stock_report(request):
    time_frame = request.GET.get("timeFrame", "Weekly")

    trunc_map = {
        "Daily": TruncDay,
        "Weekly": TruncWeek,
        "Monthly": TruncMonth,
        "Yearly": TruncYear,
    }

    trunc_function = trunc_map.get(time_frame, TruncWeek)

    now = timezone.now()

    if time_frame == "Daily":
        start_date = now - timedelta(days=now.weekday())
    elif time_frame == "Weekly":
        start_date = now.replace(day=1)
    elif time_frame == "Monthly":
        start_date = now.replace(month=1, day=1)
    else:
        start_date = None

    ledger_query = ItemLedger.objects.all()

    if start_date:
        ledger_query = ledger_query.filter(occurred_at__gte=start_date)

    ledger_by_period = (
        ledger_query
        .annotate(period=trunc_function("occurred_at"))
        .values("period")
        .annotate(totalDelta=Sum("delta"))
        .order_by("period")
    )

    current_total_stock = Item.objects.aggregate(
        total=Sum("count")
    )["total"] or 0

    data = []

    running_total = current_total_stock

    for entry in reversed(list(ledger_by_period)):
        data.insert(0, {
            "period": entry["period"].strftime("%Y-%m-%d"),
            "totalStock": running_total,
        })

        running_total -= entry["totalDelta"]

    return Response(data)
