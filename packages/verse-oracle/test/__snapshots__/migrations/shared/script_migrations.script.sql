-- Setup: create Verse migrations table

create table "__verse_migrations" (
  Id varchar(255) not null,
  primary key (Id)
);

create sequence "__verse_seqhilo" start with 1 increment by 10;

-- Migration: '2023-11-15-08-41-Initial'

create table t1 (
  id integer not null,
  name varchar(10),
  active number(1)
);

insert into "__verse_migrations" (Id) values ('2023-11-15-08-41-Initial');

-- Migration: '2023-11-16-08-42-Second'

create table t2 (
  name clob
);

insert into "__verse_migrations" (Id) values ('2023-11-16-08-42-Second');

-- Migration: '2023-11-18-08-42-AllOperations'

create table all_ops (
  col1 integer default 42,
  col9 varchar(12) not null,
  primary key (col1)
);

create index idx1 on all_ops (col9);

drop index idx1;

alter table all_ops rename to all_ops2;

alter table all_ops2 add col2 integer;

alter table all_ops2 add col4 varchar(255);

alter table all_ops2 add col11 integer generated by default on null as identity;

alter table all_ops2 modify col11 drop identity;

alter table all_ops2 modify col4 varchar(255) default 'hello!';

alter table all_ops2 modify col4 varchar(256) default null;

alter table all_ops2 modify col9 varchar(45)null;

alter table all_ops2 modify col9 varchar(45) not null;

alter table all_ops2 rename column col2 to col3;

alter table all_ops2 drop column col3;

drop table all_ops2;

insert into t1 (id) values (1);

insert into t1 (id, active) values (2, 0);

insert into t1 (id, active) values (3, 1);

update t1 set name = 'foo' where id = 2;

delete from t1 where id = 3;

insert into "__verse_migrations" (Id) values ('2023-11-18-08-42-AllOperations');

