from django.conf.urls import patterns, include, url
from django.contrib import admin
from soundscore import views


urlpatterns = patterns('',
    # Examples:
    # url(r'^api/', include(router.urls)),
    url(r'^$', 'soundscore.views.home', name='home'),
    url(r'^index/$', 'soundscore.views.index', name='index'),
    # url(r'^blog/', include('blog.urls')),

    # todo split up api urls & views if things get unwieldy
    # url(r'^api/v1/', include('soundscore.api.urls')),

    # granular views
    url(r'^api/locations/$', views.LocationList.as_view()),
    url(r'^api/locations/(?P<pk>[0-9]+)/$', views.LocationDetail.as_view()),

    url(r'^api/sensors/$', views.SensorList.as_view()),
    url(r'^api/sensors/(?P<pk>[0-9]+)/$', views.SensorDetail.as_view()),

    url(r'^api/measurements/$', views.MeasurementList.as_view()),
    url(r'^api/measurements/(?P<pk>[0-9]+)/$', views.MeasurementDetail.as_view()),

    # todo view for measurements by sensor
    # todo view for measurements by date range... slow down though, prob want to do that filtering upfront!

    # aggregation views
    url(r'^api/hours/$', views.HourList.as_view()),
    url(r'^api/hours/(?P<hour>[0-2]?[0-9])/$', views.HourDetailList.as_view()),
    url(r'^api/hours/sensor/(?P<sensor_id>[0-9]+)/$', views.HourSensorDetailList.as_view()),
    # url(r'^api/hours/id/(?P<pk>[0-9]+)/$', views.HourDetail.as_view()),

    # 1 = Sunday
    url(r'^api/weekday/(?P<day>[1-7])/$', views.WeekDayDetailList.as_view()),
    url(r'^api/monthday/(?P<day>[1-31])/$', views.MonthDayDetailList.as_view()),
    url(r'^api/month/(?P<month>[1-3])/$', views.MonthDetailList.as_view()),

    # needed?
    url(r'^api/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
)
