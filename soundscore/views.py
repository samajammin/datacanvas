from rest_framework import viewsets
from rest_framework import generics
from soundscore.models import Location, Sensor, Measurement
from soundscore.serializers import LocationSerializer, SensorSerializer, MeasurementSerializer

__author__ = 'samrichards'

from django.shortcuts import render

def home(request):
    locations = Location.objects.all()
    return render(request, 'home.html', {'locations': locations})


# serializer list views
class LocationList(generics.ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class SensorList(generics.ListAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

# todo clean this up somehow
class MeasurementList(generics.ListAPIView):
    # call to queryset is blowing up your shit
    queryset = Measurement.objects.all()
    serializer_class = MeasurementSerializer
    paginate_by = 10
    paginate_by_param = 'count'
    max_paginate_by = 100

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
