from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^session/remove/(?P<session_id>[0-9]+)/', views.remove_session),
    url(r'^session/(?P<session_id>[0-9]+)/', views.view_session),
    url(r'^submit', views.submit_session),
    url(r'^amend_session', views.amend_session),
    url(r'^$', views.index),
]