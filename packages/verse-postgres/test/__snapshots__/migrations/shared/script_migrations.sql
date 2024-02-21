-- Executing SQL: Parameters: [$1='script_migrations']
select 1
from "pg_database"
where "datname" = $1

