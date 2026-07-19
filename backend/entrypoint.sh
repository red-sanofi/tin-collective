#!/bin/sh
set -e

python manage.py makemigrations users educations announcements joinus --noinput
python manage.py compilemessages
python manage.py migrate --noinput
python manage.py setup_oauth
python manage.py collectstatic --noinput
python manage.py seed_demo

exec "$@"
