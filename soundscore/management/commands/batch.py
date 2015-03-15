
__author__ = 'samrichards'

from datetime import datetime, timedelta
from soundscore.models import Sensor, Measurement, HourlySound
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Avg, Min, Max, StdDev, Count, Variance

class Command(BaseCommand):
    # args = sf_sensors
    # help = 'some message'

    def handle(self, *args, **options):
        sensors = Sensor.objects.all()
        for sensor in sensors:
            # todo drop table
            # todo filter measurements for sensor
            measurements = Measurement.objects.filter(sensor=sensor)
            first_timestamp = measurements.earliest('timestamp').timestamp
            last_timestamp = measurements.latest('timestamp').timestamp
            print first_timestamp
            print last_timestamp
            print measurements.count()

            # first_timestamp = Measurement.objects.earliest('timestamp').timestamp
            # last_timestamp = Measurement.objects.latest('timestamp').timestamp
            time = first_timestamp - timedelta(minutes=first_timestamp.minute, seconds=first_timestamp.second, microseconds=first_timestamp.microsecond)
            while True:
                if time > last_timestamp:
                    break
                hourly_measurements = measurements.filter(timestamp__gte = time).filter(timestamp__lt = time + timedelta(hours = 1))
                # hourly_measurements = Measurement.objects.filter(timestamp__gte = time).filter(timestamp__lt = time + timedelta(hours = 1))
                if (hourly_measurements.count() == 0):
                    time += timedelta(hours = 1)
                else:
                    time = self.aggregate(hourly_measurements, time, sensor)

    @staticmethod
    def get_decibels(sound):
        return sound * 0.0158 + 49.184

    def aggregate(self, queryset, time, sensor_obj):
        h = HourlySound.objects.get_or_create(
            hour = time,
            sound_avg = self.get_decibels(queryset.aggregate(Avg('sound'))['sound__avg']),
            sound_min = self.get_decibels(queryset.aggregate(Min('sound'))['sound__min']),
            sound_max = self.get_decibels(queryset.aggregate(Max('sound'))['sound__max']),
            sound_std = self.get_decibels(queryset.aggregate(StdDev('sound'))['sound__stddev']),
            sound_var = self.get_decibels(queryset.aggregate(Variance('sound'))['sound__variance']),
            sound_count = queryset.aggregate(StdDev('sound'))['sound__stddev'],
            sensor = sensor_obj
        )
        print h
        return time + timedelta(hours = 1)
