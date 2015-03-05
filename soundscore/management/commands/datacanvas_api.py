__author__ = 'samrichards'

import requests
from datetime import datetime
from soundscore.models import Location, Sensor, Measurement, Url
from django.core.management.base import BaseCommand, CommandError

boston_sensors = [
            "ci4x0rtb9000h02tcfa5qov33",
            "ci4ooqbyw0001021o7p4qiedw",
            "ci4xird28000003zzz1soh9fj",
            "ci4ue1845000102w7ni64j7pl",
            "ci4w1npi3000p02s7a43zws7q",
            "ci4vzm23c000o02s76ezwdgxe",
            "ci4x1uh3q000j02tcnehaazvw",
            "ci5a6lluy000303z5d02xla24",
            "ci530o426000003v9a6uxvc2l",
            "ci4rb6392000102wddchkqctq",
            "ci4qaiat7000002wdidwagmmb",
            "ci4vv79v9000k02s7n4avp69i",
            "ci4w3emre000002tcnpko08o3"
        ]

sf_sensors = [
            "ci4yfbbdb000d03zzoq8kjdl0",
            "ci4yhy9yy000f03zznho5nm7c",
            "ci4yyrdqi000j03zz8ylornqd",
            "ci4vy1tfy000m02s7v29jkkx4",
            "ci4lnqzte000002xpokc9d25v",
            "ci4usvy81000302s7whpk8qlp",
            "ci4usvryz000202s7llxjafaf",
            "ci4xcxxgc000n02tci92gpvi6",
            "ci4usss1t000102s7hkg0rpqg",
            "ci4tmxpz8000002w7au38un50",
            "ci4yf50s5000c03zzt4h2tnsq",
            "ci4ut5zu5000402s7g6nihdn0"
        ]

class Command(BaseCommand):
    # args = sf_sensors
    # help = 'some message'

    def handle(self, *args, **options):
        # loop through sensors
        measurements = 0
        count = 0
        for i in sf_sensors:
            print "Grabbing data for sensor " + i
            # last url : http://localdata-sensors.herokuapp.com/api/v1/sources/ci4ut5zu5000402s7g6nihdn0/entries?before=2015-01-15T16:38:20.000Z&count=1000&sort=desc
            # url = "http://sensor-api.localdata.com/api/v1/sources/ci4vy1tfy000m02s7v29jkkx4/entries?count=1&sort=desc"
            # url = "http://sensor-api.localdata.com/api/v1/sources/" + i + "/entries?before=2015-03-01T08:09:53.000Z&count=1&sort=desc"
            url = "http://localdata-sensors.herokuapp.com/api/v1/sources/" + i + "/entries?before=2015-03-01T08:09:53.000Z&count=1000&sort=desc"
            while True:
                measurements += 1000
                count += 1
                # print "Now at " + str(count) + " URL requests and " + str(measurements) + " measurements stored"
                print "Now at " + str(count) + " URL requests."
                url = get_data(url)
                if (url == False):
                    break

# convert to python timestamp
# https://docs.python.org/2/library/datetime.html#datetime.datetime
# class datetime.datetime(year, month, day[, hour[, minute[, second[, microsecond[, tzinfo]]]]])
# suman -- better way to do this?
def get_time(timestamp):
    return datetime(
    year = int(timestamp[0:4]),
    month = int(timestamp[5:7]),
    day = int(timestamp[8:10]),
    hour = int(timestamp[11:13]),
    minute = int(timestamp[14:16]),
    second = int(timestamp[17:19]),
    microsecond = int(timestamp[20:23]),
    # todo confirm proper tzinfo format
    # tzinfo = timestamp[24]
    tzinfo = None
    )

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

    # only grab data after jan
    # todo update this so we're grabbing data from last used URL
    if (int(r.json()['data'][0]['timestamp'][5:7]) < 2):
        return False

    else:
        for i in r.json()['data']:
            ts = get_time(i['timestamp'])

            # get or create location object
            l = Location.objects.get_or_create(
                longitude = i['data']['location'][0],
                latitude = i['data']['location'][1]
            )

            # get or create sensor object
            s = Sensor.objects.get_or_create(
                source_id = i['source'],
                location = l[0]
            )

            Url.objects.update_or_create(
                url = url_request,
                sensor = s[0],
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
        if (r.json()['links'] == {}):
            return False
        else:
            return r.json()['links']['next']