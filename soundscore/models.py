from django.db import models
from django.db.models import Avg, Sum


class Location(models.Model):
    longitude = models.FloatField()
    latitude = models.FloatField()

    @property
    def avg_sound(self):
        return self.sensor.hours.aggregate(Avg('sound_avg'))['sound_avg__avg']

    @property
    def avg_var(self):
        return self.sensor.hours.aggregate(Avg('sound_var'))['sound_var__avg']

    @property
    def avg_std(self):
        return self.sensor.hours.aggregate(Avg('sound_std'))['sound_std__avg']

    @property
    def sound_count(self):
        return self.sensor.hours.aggregate(Sum('sound_count'))['sound_count_sum']

    def __unicode__(self):
        return u"[{}, {}]".format(self.longitude, self.latitude)

    class Meta:
        unique_together = ('longitude', 'latitude',)


class Sensor(models.Model):
    source_id = models.CharField(max_length=120, unique=True)
    nickname = models.CharField(max_length=120, blank=True)
    # assumes one to one relationship... i.e. sensors don't change locations & never will have multiple sensors at the same location
    location = models.OneToOneField(Location)

    def __unicode__(self):
        return u"{}".format(self.source_id)


class Measurement(models.Model):
    timestamp = models.DateTimeField()
    air_quality = models.CharField(max_length=100)
    air_quality_raw = models.IntegerField()
    dust = models.IntegerField()
    humidity = models.IntegerField()
    light = models.IntegerField()
    sound = models.IntegerField()
    temperature = models.IntegerField()
    uv = models.IntegerField()
    sensor = models.ForeignKey(Sensor, related_name='measurements')

    def __unicode__(self):
        return u"{} at {}".format(self.sensor, self.timestamp)

    class Meta:
        unique_together = ('timestamp', 'sensor',)

    @property
    def decibels(self):
        return self.sound * 0.0158 + 49.184


class Url(models.Model):
    url = models.URLField(max_length=1000, unique=True)
    sensor = models.ForeignKey(Sensor, related_name='urls')
    date_created = models.DateTimeField(auto_now_add=True)
    date_last_visited = models.DateTimeField(auto_now_add=True)


    def __unicode__(self):
        return u"{}".format(self.url)


class HourlySound(models.Model):
    hour = models.DateTimeField()
    sound_avg = models.FloatField()
    sound_min = models.FloatField()
    sound_max = models.FloatField()
    sound_std = models.FloatField()
    sound_var = models.FloatField()
    sound_count = models.IntegerField()
    sensor = models.ForeignKey(Sensor, related_name='hours')

    def __unicode__(self):
        return u"{} sound aggregated at {}".format(self.sensor, self.hour)

    class Meta:
        unique_together = ('hour', 'sensor',)

# class DailySound(models.Model):
#     date = models.DateField()
#     sound_avg = models.FloatField()
#     sound_min = models.FloatField()
#     sound_max = models.FloatField()
#     sound_std = models.FloatField()
#     sound_var = models.FloatField()
#     sound_count = models.IntegerField()
#     sensor = models.ForeignKey(Sensor, related_name='hours')
#
#     def __unicode__(self):
#         return u"{} at {}".format(self.sensor, self.date)
#
#     class Meta:
#         unique_together = ('date', 'sensor',)
#
# #     todo get DOW

