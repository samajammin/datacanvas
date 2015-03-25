__author__ = 'samrichards'
from soundscore.models import Location, Sensor, Measurement, HourlySound
from rest_framework import serializers

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('id', 'longitude', 'latitude', 'sensor', 'avg_sound', 'avg_var', 'avg_std', 'sound_count')


class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        # fields = ('id', 'source_id', 'nickname', 'location')


class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        fields = ('id', 'timestamp', 'sensor', 'sound', 'decibels')


class HourSerializer(serializers.ModelSerializer):
    class Meta:
        model = HourlySound
        # fields = ('id', 'hour', 'sound_avg', 'sound_count', 'sensor')