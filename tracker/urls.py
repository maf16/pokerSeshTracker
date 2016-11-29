from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^submit', views.submit),
    url(r'^$', views.index)
]