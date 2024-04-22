-- Setup: create Verse migrations table

create table "__verse_migrations" (
  "Id" varchar(255) not null,
  primary key ("Id")
);

-- Migration: '2023-11-15-08-41-Initial'

create table "t1" (
  "id" integer not null,
  "name" varchar(10),
  "active" bit
);

insert into "__verse_migrations" ("Id") values ('2023-11-15-08-41-Initial');

-- Migration: '2023-11-16-08-42-Second'

create table "t2" (
  "name" text
);

insert into "__verse_migrations" ("Id") values ('2023-11-16-08-42-Second');

-- Migration: '2023-11-18-08-42-AllOperations'

create table "all_ops" (
  "col1" integer default 42,
  "col9" varchar(12) not null,
  primary key ("col1")
);

create index "idx1" on "all_ops" ("col9");

drop index "all_ops"."idx1";

sp_rename 'all_ops', 'all_ops2';

alter table "all_ops2" add "col2" integer;

alter table "all_ops2" add "col4" varchar(255);

alter table "all_ops2" alter column "col4" varchar(255);
alter table "all_ops2" add constraint "df_all_ops2_col4" default 'hello!' for "col4";

declare @name nvarchar(128)
select @name = object_name(default_object_id) from sys.columns
where object_id = object_id('all_ops2') and name = 'col4'
exec('alter table "all_ops2" drop constraint ' + @name);
alter table "all_ops2" alter column "col4" varchar(256);

alter table "all_ops2" alter column "col9" varchar(45);

alter table "all_ops2" alter column "col9" varchar(45) not null;

sp_rename 'all_ops2.col2', "col3", 'COLUMN';

alter table "all_ops2" drop column "col3";

drop table "all_ops2";

insert into t1 (id) values (1);

insert into "t1" ("id", "active") values (2, 0);

insert into "t1" ("id", "active") values (3, 1);

update "t1" set "name" = 'foo' where "id" = 2;

delete from "t1" where "id" = 3;

insert into "__verse_migrations" ("Id") values ('2023-11-18-08-42-AllOperations');

