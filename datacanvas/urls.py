from django.conf.urls import patterns, include, url
from django.contrib import admin

# Serializers define the API representation.
from rest_framework import serializers, viewsets, routers
from soundscore.models import Location


class LocationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Location
        fields = ('longitude', 'latitude')

# ViewSets define the view behavior.
class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'locations', LocationViewSet)

urlpatterns = patterns('',
    # Examples:
    url(r'^', include(router.urls)),
    # url(r'^$', 'soundscore.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^api/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
)
