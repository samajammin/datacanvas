# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('soundscore', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Url',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url', models.URLField(unique=True, max_length=1000)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_last_visited', models.DateTimeField(auto_now_add=True)),
                ('sensor', models.ForeignKey(related_name='urls', to='soundscore.Sensor')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='measurement',
            unique_together=set([('timestamp', 'sensor')]),
        ),
    ]
