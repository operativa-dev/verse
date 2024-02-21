-- Executing SQL: Parameters: []
create database "migrations_status"

-- Executing SQL: Parameters: [$1='migrations_status']
select 1
from "pg_database"
where "datname" = $1

-- Executing SQL: Parameters: [$1='__verse_migrations']
select 1
from "information_schema"."tables"
where ("table_schema" = 'public') and ("table_name" = $1)

