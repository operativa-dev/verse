-- Executing SQL: Parameters: [$1='CREATE_DATABASE_WHEN_NOT_EXIST']
select 1 from all_users where username = :0

-- Executing SQL: Parameters: []
create user create_database_when_not_exist identified by create_database_when_not_exist

-- Executing SQL: Parameters: []
grant create session to create_database_when_not_exist

-- Executing SQL: Parameters: []
grant create table to create_database_when_not_exist

-- Executing SQL: Parameters: []
grant create sequence to create_database_when_not_exist

-- Executing SQL: Parameters: []
grant unlimited tablespace to create_database_when_not_exist

-- Executing SQL: Parameters: []
create table "__verse_migrations" (
  Id varchar(255) not null,
  primary key (Id)
)

-- Executing SQL: Parameters: []
create sequence "__verse_seqhilo" start with 1 increment by 10

-- Executing SQL: Parameters: []
create table t1 (
  id integer not null,
  name varchar(10),
  active number(1)
)

-- Executing SQL: Parameters: []
insert into "__verse_migrations" (Id) values ('2023-11-15-08-41-Initial')

-- Executing SQL: Parameters: []
create table t2 (
  name clob
)

-- Executing SQL: Parameters: []
insert into "__verse_migrations" (Id) values ('2023-11-16-08-42-Second')

-- Executing SQL: Parameters: []
create table all_ops (
  col1 integer
)

-- Executing SQL: Parameters: []
create index idx1 on all_ops (col1)

-- Executing SQL: Parameters: []
drop index idx1

-- Executing SQL: Parameters: []
alter table all_ops rename to all_ops2

-- Executing SQL: Parameters: []
alter table all_ops2 add col2 integer

-- Executing SQL: Parameters: []
alter table all_ops2 rename column col2 to col3

-- Executing SQL: Parameters: []
alter table all_ops2 drop column col3

-- Executing SQL: Parameters: []
drop table all_ops2

-- Executing SQL: Parameters: []
insert into t1 (id) values (1)

-- Executing SQL: Parameters: []
insert into t1 (id, active) values (2, 0)

-- Executing SQL: Parameters: []
insert into t1 (id, active) values (3, 1)

-- Executing SQL: Parameters: []
update t1 set name = 'foo' where id = 2

-- Executing SQL: Parameters: []
delete from t1 where id = 3

-- Executing SQL: Parameters: []
insert into "__verse_migrations" (Id) values ('2023-11-18-08-42-AllOperations')

-- Executing SQL: Parameters: [$1='CREATE_DATABASE_WHEN_NOT_EXIST']
select 1 from all_users where username = :0

