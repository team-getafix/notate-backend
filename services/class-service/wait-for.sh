#!/bin/sh
# simple postgres wait

set -e

host="$1"
shift
cmd="$@"

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$host" -U "admin" -d "notatedb" -c '\q'; do
  >&2 echo "postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "postgres is up - executing command"
exec $cmd