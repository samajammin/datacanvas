import os

__author__ = 'samrichards'



if 'RDS_DB_NAME' in os.environ:
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
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'datacanvas',
        }
    }