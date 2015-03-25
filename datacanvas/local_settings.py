import os

__author__ = 'samrichards'


if 'RDS_DB_NAME' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': os.environ['RDS_DB_NAME'],
            'USER': os.environ['RDS_USERNAME'],
            'PASSWORD': os.environ['RDS_PASSWORD'],
            'HOST': os.environ['RDS_HOSTNAME'],
            'PORT': os.environ['RDS_PORT'],
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'datacanvas',
            'USER': 'samrichards',
            'PASSWORD': 'SoundScore4tw',
            'HOST': 'datacanvas-instance-1.c8ul9yqkcqls.us-west-1.rds.amazonaws.com',
            'PORT': '5432',
        }
    }