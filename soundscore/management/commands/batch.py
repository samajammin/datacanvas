
__author__ = 'samrichards'

from datetime import datetime
from soundscore.models import Sensor, Measurement, HourlySound
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Avg, Min, Max, StdDev, Count, Variance


# todo aggregate measurements on hourly batches and save as entries into houravg

# todo these vars should prob not be global...

delta = datetime.timedelta(hours=1)
time = datetime.datetime(
    year = 2015,
    month = 1,
    day = 1,
    hour = 0,
)

class Command(BaseCommand):
    # args = sf_sensors
    # help = 'some message'

    def handle(self, *args, **options):

        # sensors = Sensor.objects.all()
        sensors = Sensor.objects.get(pk=1)

        for sensor in sensors:
            while True:
                hourly_measurements = Measurement.objects.filter(timestamp__gte=time).filter(timestamp__lt=time+delta)
                if (hourly_measurements.count() == 0):
                    break
                time = self.aggregate(hourly_measurements, sensor)

    @staticmethod
    def get_decibels(sound):
        return sound * 0.0158 + 49.184

    def aggregate(self, queryset, sensor_obj):
        h = HourlySound.get_or_create(
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
        return time + delta
