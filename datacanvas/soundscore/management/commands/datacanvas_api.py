__author__ = 'samrichards'

import requests
from datetime import datetime
from soundscore.models import Location, Sensor, Measurement, Url
from django.core.management.base import BaseCommand, CommandError

sf_sensors = [
            "ci4yfbbdb000d03zzoq8kjdl0",
            "ci4yhy9yy000f03zznho5nm7c",
            "ci4yyrdqi000j03zz8ylornqd",
            "ci4vy1tfy000m02s7v29jkkx4",
            "ci4lnqzte000002xpokc9d25v",
            "ci4usvy81000302s7whpk8qlp", # not sure why but got an IntegrityError: duplicate key value violates unique constraint "soundscore_sensor_source_id_key" DETAIL:  Key (source_id)=(ci4usvy81000302s7whpk8qlp) already exists. out of the blue
            "ci4usvryz000202s7llxjafaf", # last request: http://localdata-sensors.herokuapp.com/api/v1/sources/ci4usvryz000202s7llxjafaf/entries?before=2015-02-08T23:51:31.000Z&count=1000&sort=desc
            "ci4xcxxgc000n02tci92gpvi6",
            "ci4usss1t000102s7hkg0rpqg",
            "ci4tmxpz8000002w7au38un50",
            "ci4yf50s5000c03zzt4h2tnsq",
            "ci4ut5zu5000402s7g6nihdn0"
        ]

# todo... should return URL on integrity errors for debugging purposes

class Command(BaseCommand):
    # args = sf_sensors
    # help = 'some message'

    def handle(self, *args, **options):
        # loop through sensors
        for i in sf_sensors:
            count = 0
            print "Grabbing data for sensor " + i
            # last url : http://localdata-sensors.herokuapp.com/api/v1/sources/ci4ut5zu5000402s7g6nihdn0/entries?before=2015-01-15T16:38:20.000Z&count=1000&sort=desc
            url = "http://sensor-api.localdata.com/api/v1/sources/" + i + "/entries?count=1000&sort=desc"
            # url = "http://sensor-api.localdata.com/api/v1/sources/" + i + "/entries?before=2015-03-01T08:09:53.000Z&count=1000&sort=desc"
            # url = "http://localdata-sensors.herokuapp.com/api/v1/sources/" + i + "/entries?before=2015-03-01T00:00:01.000Z&count=1000&sort=desc"
            # url = "http://localdata-sensors.herokuapp.com/api/v1/sources/" + i + "/entries?after=2015-01-01T00:00:00.000Z&count=1000&sort=asc"
            while True:
                count += 1
                print "Now at " + str(count) + " URL requests for sensor " + i
                url = self.get_data(url)
                if (url == False):
                    break

    @staticmethod
    def get_data(url_request):
        r = requests.get(url_request)

        # check response code
        if (r.status_code != 200):
            print "Request attempt failed."
            print "There was a" + r.status_code + "error retrieving " + url_request
            raise CommandError('There was a "%s" error' % r.status_code)

        # check return is JSON
        if (r.headers['content-type'] != "application/json; charset=utf-8"):
            print "The return data is not JSON"
            return False

        # confirm there's data
        if (len(r.json()['data']) == 0):
            print "No more data."
            return False

        else:
            for i in r.json()['data']:
                ts = datetime.strptime(i['timestamp'], '%Y-%m-%dT%H:%M:%S.%fZ')

                # restrict date range
                if (ts < datetime.strptime('2015-03-01', '%Y-%m-%d')):
                    print 'Out of time range.'
                    return False

                # check for faulty location (sensor pk = 12)
                if (i['data']['location'][0] == 37.7648):
                    l = Location.objects.get_or_create(
                        longitude = i['data']['location'][1],
                        latitude = i['data']['location'][0]
                    )
                # get or create location object
                else:
                    l = Location.objects.get_or_create(
                        longitude = i['data']['location'][0],
                        latitude = i['data']['location'][1]
                    )

                # get or create sensor object
                s = Sensor.objects.get_or_create(
                    source_id = i['source'],
                    # todo confirm this does what we want... i think i created new location without assigning a sensor to the location... think we need these both present
                    defaults = {'location' : l[0]}
                )

                Url.objects.update_or_create(
                    url = url_request,
                    sensor = s[0],
                    # check w/ Suman... looks like defaults are for optional vars: https://docs.djangoproject.com/en/1.7/ref/models/querysets/
                    defaults = {'date_last_visited': datetime.now()}

                )

                # get or create measurement object
                # todo look into bulk create
                # https://docs.djangoproject.com/en/1.7/ref/models/querysets/#bulk-create
                Measurement.objects.get_or_create(
                    timestamp = ts,
                    air_quality = i['data']['airquality'],
                    air_quality_raw = i['data']['airquality_raw'],
                    dust = i['data']['dust'],
                    humidity = i['data']['humidity'],
                    light = i['data']['light'],
                    sound = i['data']['sound'],
                    temperature = i['data']['temperature'],
                    uv = i['data']['uv'],
                    sensor = s[0]
                )

            print "Now at " + str(Measurement.objects.filter(sensor=s[0]).count()) + " measurements for " + str(s[0])

            # return false if 'links' is empty. otherwise return next url
            # http://localdata-sensors.herokuapp.com/api/v1/sources/ci4ut5zu5000402s7g6nihdn0/entries?before=2015-01-15T16:38:20.000Z&count=1000&sort=desc
            if (len(r.json()['links']) == 0):
                print "No more links."
                return False
            else:
                return r.json()['links']['next']
                # return r.json()['links']['prev']