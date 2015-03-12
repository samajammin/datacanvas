# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('soundscore', '0002_auto_20150304_2341'),
    ]

    operations = [
        migrations.CreateModel(
            name='DayAvg',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateField()),
                ('air_quality', models.CharField(max_length=100)),
                ('air_quality_raw', models.IntegerField()),
                ('dust', models.IntegerField()),
                ('humidity', models.IntegerField()),
                ('light', models.IntegerField()),
                ('sound', models.IntegerField()),
                ('temperature', models.IntegerField()),
                ('uv', models.IntegerField()),
                ('sensor', models.ForeignKey(related_name='days', to='soundscore.Sensor')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HourAvg',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('hour', models.DateTimeField()),
                ('air_quality', models.CharField(max_length=100)),
                ('air_quality_raw', models.IntegerField()),
                ('dust', models.IntegerField()),
                ('humidity', models.IntegerField()),
                ('light', models.IntegerField()),
                ('sound', models.IntegerField()),
                ('temperature', models.IntegerField()),
                ('uv', models.IntegerField()),
                ('sensor', models.ForeignKey(related_name='hours', to='soundscore.Sensor')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='houravg',
            unique_together=set([('hour', 'sensor')]),
        ),
        migrations.AlterUniqueTogether(
            name='dayavg',
            unique_together=set([('date', 'sensor')]),
        ),
    ]
