import datetime
from django.db import models

class Location(models.Model):
    # todo consider other field formats. Decimal didn't work with API script
    # https://docs.djangoproject.com/en/1.7/ref/contrib/gis/model-api/#geography
    # longitude = models.DecimalField(max_digits=9, decimal_places=6)
    # latitude = models.DecimalField(max_digits=8, decimal_places=6)
    longitude = models.FloatField()
    latitude = models.FloatField()

    def __unicode__(self):
        return u"[{}, {}]".format(self.longitude, self.latitude)

    # todo other location api to pull in additional info... overwrite save method?
    # city / neighborhood / country / continent
    # def get_info (self):

    class Meta:
        unique_together = ('longitude', 'latitude',)


class Sensor(models.Model):
    source_id = models.CharField(max_length=120, unique=True)
    nickname = models.CharField(max_length=120, blank=True)
    # assuming one to one relationship... i.e. sensors don't change locations & never will have multiple sensors at the same location
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

    # todo convert db

    class Meta:
        unique_together = ('timestamp', 'sensor',)

    # dB = 0.0158x + 49.184
    def get_decibels(self):
        return self.sound * 0.0158 + 49.184



class Url(models.Model):
    url = models.URLField(max_length=1000, unique=True)
    sensor = models.ForeignKey(Sensor, related_name='urls')
    date_created = models.DateTimeField(auto_now_add=True)
    date_last_visited = models.DateTimeField(auto_now_add=True)


    def __unicode__(self):
        return u"{}".format(self.url)