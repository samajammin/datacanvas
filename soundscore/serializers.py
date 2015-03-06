__author__ = 'samrichards'
from soundscore.models import Location, Sensor, Measurement
from rest_framework import serializers

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        # fields = ('id', 'longitude', 'latitude')


class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        # fields = ('id', 'source_id', 'nickname', 'location')


class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        # fields = ('id', 'source_id', 'nickname', 'location')
