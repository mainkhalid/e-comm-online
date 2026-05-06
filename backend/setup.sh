#!/bin/bash
# TechZone Backend — Ubuntu setup script
# Run once after cloning the repo: bash setup.sh

set -e

echo "==> Creating Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate

echo "==> Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "==> Copying .env file..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "    .env created — edit it with your credentials before continuing."
fi

echo "==> Creating PostgreSQL database..."
# Assumes PostgreSQL is installed and 'postgres' superuser exists
psql -U postgres -c "CREATE DATABASE techzone_db;" 2>/dev/null || echo "    Database may already exist, skipping."

echo "==> Running migrations..."
python manage.py migrate

echo "==> Creating superuser..."
python manage.py createsuperuser

echo ""
echo "Setup complete! To start the dev server:"
echo "  source .venv/bin/activate"
echo "  python manage.py runserver"
