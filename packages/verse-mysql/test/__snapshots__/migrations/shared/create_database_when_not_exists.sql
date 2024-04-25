-- Executing SQL: Parameters: [$1='create_database_when_not_exist']
select 1
from `information_schema`.`schemata`
where `schema_name` = ?

-- Executing SQL: Parameters: []
create database `create_database_when_not_exist`

-- Executing SQL: Parameters: []
create table `__verse_migrations` (
  `Id` varchar(255) not null,
  primary key (`Id`)
)

-- Executing SQL: Parameters: []
create table `t1` (
  `id` integer not null,
  `name` varchar(10),
  `active` boolean
)

-- Executing SQL: Parameters: []
insert into `__verse_migrations` (`Id`) values ('2023-11-15-08-41-Initial')

-- Executing SQL: Parameters: []
create table `t2` (
  `name` text
)

-- Executing SQL: Parameters: []
insert into `__verse_migrations` (`Id`) values ('2023-11-16-08-42-Second')

-- Executing SQL: Parameters: []
create table `all_ops` (
  `col1` integer default 42,
  `col9` varchar(12) not null,
  primary key (`col1`)
)

-- Executing SQL: Parameters: []
create index `idx1` on `all_ops` (`col9`)

-- Executing SQL: Parameters: []
drop index `idx1` on `all_ops`

-- Executing SQL: Parameters: []
alter table `all_ops` rename to `all_ops2`

-- Executing SQL: Parameters: []
alter table `all_ops2` add `col2` integer

-- Executing SQL: Parameters: []
alter table `all_ops2` add `col4` varchar(255)

-- Executing SQL: Parameters: []
alter table `all_ops2` alter `col1` drop default;
alter table `all_ops2` modify column `col1` integer auto_increment

-- Executing SQL: Parameters: []
alter table `all_ops2` modify column `col1` integer

-- Executing SQL: Parameters: []
alter table `all_ops2` alter `col4` set default 'hello!';
alter table `all_ops2` modify column `col4` varchar(255)

-- Executing SQL: Parameters: []
alter table `all_ops2` alter `col4` drop default;
alter table `all_ops2` modify column `col4` varchar(256)

-- Executing SQL: Parameters: []
alter table `all_ops2` modify column `col9` varchar(45)

-- Executing SQL: Parameters: []
alter table `all_ops2` modify column `col9` varchar(45) not null

-- Executing SQL: Parameters: []
alter table `all_ops2` rename column `col2` to `col3`

-- Executing SQL: Parameters: []
alter table `all_ops2` drop column `col3`

-- Executing SQL: Parameters: []
drop table `all_ops2`

-- Executing SQL: Parameters: []
insert into t1 (id) values (1)

-- Executing SQL: Parameters: []
insert into `t1` (`id`, `active`) values (2, 0)

-- Executing SQL: Parameters: []
insert into `t1` (`id`, `active`) values (3, 1)

-- Executing SQL: Parameters: []
update `t1` set `name` = 'foo' where `id` = 2

-- Executing SQL: Parameters: []
delete from `t1` where `id` = 3

-- Executing SQL: Parameters: []
create table `moar` (
  `colA` integer not null,
  `colB` varchar(12)
)

-- Executing SQL: Parameters: []
create table `other` (
  `colA1` integer,
  `colB2` varchar(12)
)

-- Executing SQL: Parameters: []
alter table `moar`
  add primary key (`colA`)

-- Executing SQL: Parameters: []
alter table `other` add foreign key (`colA1`) references `moar` (`colA`)

-- Executing SQL: Parameters: []
insert into `__verse_migrations` (`Id`) values ('2023-11-18-08-42-AllOperations')

-- Executing SQL: Parameters: [$1='create_database_when_not_exist']
select 1
from `information_schema`.`schemata`
where `schema_name` = ?

