-- Executing SQL: Parameters: []
create database "migrations_status"

-- Executing SQL: Parameters: [$1='migrations_status']
select 1
from "sys"."databases"
where "name" = @p0

-- Executing SQL: Parameters: [$1='__verse_migrations']
select 1
from "information_schema"."tables"
where ("table_schema" = 'migrations_status') and ("table_name" = @p0)

