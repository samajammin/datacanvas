from django.conf.urls import patterns, include, url
from django.contrib import admin
from soundscore import views


urlpatterns = patterns('',
    # Examples:
    # url(r'^api/', include(router.urls)),
    url(r'^$', 'soundscore.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    # url(r'^api/v1/', include('soundscore.api.urls')),
    url(r'^api/locations/$', views.LocationList.as_view()),
    url(r'^api/locations/(?P<pk>[0-9]+)/$', views.LocationDetail.as_view()),

    url(r'^api/sensors/$', views.SensorList.as_view()),
    url(r'^api/sensors/(?P<pk>[0-9]+)/$', views.SensorDetail.as_view()),

    url(r'^api/measurements/$', views.MeasurementList.as_view()),
    url(r'^api/measurements/(?P<pk>[0-9]+)/$', views.MeasurementDetail.as_view()),

    url(r'^api/hours/$', views.HourList.as_view()),
    url(r'^api/hours/(?P<hour>[0-2]?[0-3])/$', views.HourDetailList.as_view()),
    url(r'^api/hours/id/(?P<pk>[0-9]+)/$', views.HourDetail.as_view()),

    # needed?
    url(r'^api/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
)
