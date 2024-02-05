from django.contrib import admin

from .models import Cat, Comment


@admin.register(Cat)
class CatAdmin(admin.ModelAdmin):
    search_fields = ("name", "bred", "description")
    list_display = ("name", "breed", "description", "birthday")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    search_fields = ("text", "cat__name")
    list_display = ("cat", "note", "text")
    list_select_related = ("cat",)
