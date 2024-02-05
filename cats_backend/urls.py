"""
URL configuration for cats_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework import routers

from cats.views import CatsViewSet, CommentsViewSet

router = routers.DefaultRouter()
router.register(r"cats", CatsViewSet)
router.register(r"comments", CommentsViewSet)

api_v1_patterns = [
    path("", include(router.urls)),
]


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("v1/", include((api_v1_patterns, 'cats_backend'), namespace='v1')),
    path("", RedirectView.as_view(url="v1/")),
    path("schema/", SpectacularAPIView.as_view(api_version='v1'), name="schema"),
    # Optional UI:
    path(
        "schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"
    ),
    path("docs/", RedirectView.as_view(url="../schema/swagger-ui/")),
]
