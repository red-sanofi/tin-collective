#!/bin/sh
set -e

python manage.py makemigrations users educations announcements joinus --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py seed_demo

exec "$@"
