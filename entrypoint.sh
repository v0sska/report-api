#!/bin/sh

# Очікуємо, поки база даних стане доступною
echo "Waiting for database to be ready..."
until nc -z -v -w30 postgres 5432
do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

echo "Database is ready. Running migrations..."
npx prisma db push

echo "Starting the application..."
exec npm run start:prod
