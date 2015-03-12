from rest_framework import viewsets
from rest_framework import generics
from soundscore.models import Location, Sensor, Measurement, HourlySound
from soundscore.serializers import LocationSerializer, SensorSerializer, MeasurementSerializer, HourSerializer

__author__ = 'samrichards'

# serializer list views
class LocationList(generics.ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class SensorList(generics.ListAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

# todo may want clean this up somehow by limiting queryset grab
class MeasurementList(generics.ListAPIView):
    queryset = Measurement.objects.all()
    serializer_class = MeasurementSerializer
    paginate_by = 100
    paginate_by_param = 'count'
    max_paginate_by = 1000000

class HourList(generics.ListAPIView):
    queryset = HourlySound.objects.all()
    serializer_class = HourSerializer
    paginate_by = 100
    paginate_by_param = 'count'
    max_paginate_by = 1000000

class HourDetailList(generics.ListAPIView):
    serializer_class = HourSerializer
    # lookup_field = 'hour'
    queryset = HourlySound.objects.all()
    # serializer_class = HourSerializer
    # paginate_by = 100
    # paginate_by_param = 'count'
    # max_paginate_by = 1000000

    def get_queryset(self):
        hour_range = self.kwargs['hour']
        return HourlySound.objects.filter(hour__hour=hour_range)



# serializer details views
class LocationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class SensorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

class MeasurementDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Measurement.objects.all()
    serializer_class = MeasurementSerializer

class HourDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = HourlySound.objects.all()
    serializer_class = HourSerializer