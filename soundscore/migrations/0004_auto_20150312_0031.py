# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('soundscore', '0003_auto_20150311_2252'),
    ]

    operations = [
        migrations.CreateModel(
            name='HourlySound',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('hour', models.DateTimeField()),
                ('sound_avg', models.FloatField()),
                ('sound_min', models.FloatField()),
                ('sound_max', models.FloatField()),
                ('sound_std', models.FloatField()),
                ('sound_var', models.FloatField()),
                ('sound_count', models.IntegerField()),
                ('sensor', models.ForeignKey(related_name='hours', to='soundscore.Sensor')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='dayavg',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='dayavg',
            name='sensor',
        ),
        migrations.DeleteModel(
            name='DayAvg',
        ),
        migrations.AlterUniqueTogether(
            name='houravg',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='houravg',
            name='sensor',
        ),
        migrations.DeleteModel(
            name='HourAvg',
        ),
        migrations.AlterUniqueTogether(
            name='hourlysound',
            unique_together=set([('hour', 'sensor')]),
        ),
    ]
