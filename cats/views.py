import django_filters
from django.db.models import Avg
from django_filters import FilterSet
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.viewsets import ModelViewSet

from cats.models import Cat, Comment

# serializers definitions


class CatSerializer(ModelSerializer):
    avg_rating = serializers.FloatField(
        read_only=True, help_text="average rating over all comments"
    )

    class Meta:
        model = Cat
        fields = ("id", "name", "breed", "description", "birthday", "avg_rating")  # ?


class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ("id", "created", "modified", "cat", "text", "note")


# filtersets definitions


class CatFilterSet(FilterSet):
    avg_rating__gt = django_filters.NumberFilter(
        field_name="avg_rating", lookup_expr="gt"
    )
    avg_rating__lt = django_filters.NumberFilter(
        field_name="avg_rating", lookup_expr="lt"
    )

    class Meta:
        model = Cat
        fields = {
            "name": ["exact", "in", "contains"],
            "breed": ["exact", "in", "contains"],
            "description": ["exact", "in", "contains"],
            "birthday": ["exact", "gt", "lt", "gte", "lte", "in", "range"],
        }


class CommentFilterSet(FilterSet):
    class Meta:
        model = Comment
        fields = {
            "cat": ["exact", "in"],
            "text": ["exact", "contains"],
            "note": ["exact", "gt", "lt", "gte", "lte", "range"],
            "created": ["gt", "lt"],
        }


# viewsets definitions


class CatsViewSet(ModelViewSet):
    queryset = Cat.objects.all().annotate(avg_rating=Avg("comments__note"))
    serializer_class = CatSerializer
    filterset_class = CatFilterSet
    search_fields = ["name", "breed", "description"]
    ordering_fields = ["id", "name", "breed", "avg_rating"]  # ?
    ordering = ["-avg_rating"]


class CommentsViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filterset_class = CommentFilterSet
    ordering_fields = ["created", "note"]
    ordering = ["created"]
