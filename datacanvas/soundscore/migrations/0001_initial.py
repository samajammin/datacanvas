# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('longitude', models.FloatField()),
                ('latitude', models.FloatField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Measurement',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('timestamp', models.DateTimeField()),
                ('air_quality', models.CharField(max_length=100)),
                ('air_quality_raw', models.IntegerField()),
                ('dust', models.IntegerField()),
                ('humidity', models.IntegerField()),
                ('light', models.IntegerField()),
                ('sound', models.IntegerField()),
                ('temperature', models.IntegerField()),
                ('uv', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Sensor',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('source_id', models.CharField(unique=True, max_length=120)),
                ('nickname', models.CharField(max_length=120, blank=True)),
                ('location', models.OneToOneField(to='soundscore.Location')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='measurement',
            name='sensor',
            field=models.ForeignKey(related_name='measurements', to='soundscore.Sensor'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='location',
            unique_together=set([('longitude', 'latitude')]),
        ),
    ]
