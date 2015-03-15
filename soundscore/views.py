from rest_framework import viewsets
from rest_framework import generics
from soundscore.models import Location, Sensor, Measurement, HourlySound
from soundscore.serializers import LocationSerializer, SensorSerializer, MeasurementSerializer, HourSerializer
from django.shortcuts import render

__author__ = 'samrichards'

# template views
def home(request):
    locations = Location.objects.all()
    return render(request, 'home.html', {'locations': locations})

def index(request):
    locations = Location.objects.all()
    return render(request, 'index.html', {'locations': locations})

# api views

# list views
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

# detail list views
class HourSensorDetailList(generics.ListAPIView):
    serializer_class = HourSerializer
    queryset = HourlySound.objects.all()
    paginate_by = 100
    paginate_by_param = 'count'
    max_paginate_by = 1000000

    def get_queryset(self):
        sensor_id = self.kwargs['sensor_id']
        return HourlySound.objects.filter(sensor=sensor_id)

class HourDetailList(generics.ListAPIView):
    serializer_class = HourSerializer
    queryset = HourlySound.objects.all()
    paginate_by = 100
    paginate_by_param = 'count'
    max_paginate_by = 1000000

    def get_queryset(self):
        hour_range = self.kwargs['hour']
        return HourlySound.objects.filter(hour__hour=hour_range)

class WeekDayDetailList(generics.ListAPIView):
    serializer_class = HourSerializer
    queryset = HourlySound.objects.all()
    paginate_by = 100
    paginate_by_param = 'count'
    max_paginate_by = 1000000

    def get_queryset(self):
        day_range = self.kwargs['day']
        return HourlySound.objects.filter(hour__week_day=day_range)

class MonthDayDetailList(generics.ListAPIView):
    serializer_class = HourSerializer
    queryset = HourlySound.objects.all()
    paginate_by = 100
    paginate_by_param = 'count'
    max_paginate_by = 1000000

    def get_queryset(self):
        day_range = self.kwargs['day']
        return HourlySound.objects.filter(hour__day=day_range)

class MonthDetailList(generics.ListAPIView):
    serializer_class = HourSerializer
    queryset = HourlySound.objects.all()
    paginate_by = 100
    paginate_by_param = 'count'
    max_paginate_by = 1000000

    def get_queryset(self):
        month = self.kwargs['month']
        return HourlySound.objects.filter(hour__month=month)


# detail views
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