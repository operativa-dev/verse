-- Executing SQL: Parameters: []
create user migrations_status identified by migrations_status

-- Executing SQL: Parameters: []
grant create session to migrations_status

-- Executing SQL: Parameters: []
grant create table to migrations_status

-- Executing SQL: Parameters: []
grant create sequence to migrations_status

-- Executing SQL: Parameters: []
grant unlimited tablespace to migrations_status

-- Executing SQL: Parameters: [$1='MIGRATIONS_STATUS']
select 1 from all_users where username = :0

-- Executing SQL: Parameters: [$1='__verse_migrations']
select 1
from all_tables
where table_name = :0

