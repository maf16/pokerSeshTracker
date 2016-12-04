from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^session/remove/(?P<session_id>[0-9]+)/', views.remove_session),
    url(r'^session/(?P<session_id>[0-9]+)/', views.view_session),
    url(r'^session/submit', views.submit_session),
    url(r'^session/amend/(?P<session_id>[0-9]+)', views.amend_session),
    url(r'^$', views.index),
]