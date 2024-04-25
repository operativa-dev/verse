-- Setup: create Verse migrations table

create table "__verse_migrations" (
  "Id" varchar(255) not null,
  primary key ("Id")
);

create sequence "__verse_seqhilo" start with 1 increment by 10;

-- Migration: '2023-11-15-08-41-Initial'

create table "t1" (
  "id" integer not null,
  "name" varchar(10),
  "active" boolean
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

drop index "idx1";

alter table "all_ops" rename to "all_ops2";

alter table "all_ops2" add "col2" integer;

alter table "all_ops2" add "col4" varchar(255);

alter table "all_ops2"
  alter "col1" set default null,
  alter "col1" add generated always as identity,
  alter "col1" type integer;

alter table "all_ops2"
  alter "col1" drop identity,
  alter "col1" type integer;

alter table "all_ops2"
  alter "col4" set default 'hello!',
  alter "col4" type varchar(255);

alter table "all_ops2"
  alter "col4" set default null,
  alter "col4" type varchar(256);

alter table "all_ops2"
  alter "col9" drop not null,
  alter "col9" type varchar(45);

alter table "all_ops2"
  alter "col9" set not null,
  alter "col9" type varchar(45);

alter table "all_ops2" rename column "col2" to "col3";

alter table "all_ops2" drop column "col3";

drop table "all_ops2";

create sequence "seq1" start with 1 increment by 1;

drop sequence "seq1";

insert into t1 (id) values (1);

insert into "t1" ("id", "active") values (2, false);

insert into "t1" ("id", "active") values (3, true);

update "t1" set "name" = 'foo' where "id" = 2;

delete from "t1" where "id" = 3;

create table "moar" (
  "colA" integer not null,
  "colB" varchar(12)
);

create table "other" (
  "colA1" integer,
  "colB2" varchar(12)
);

alter table "moar"
  add primary key ("colA");

alter table "other" add foreign key ("colA1") references "moar" ("colA");

insert into "__verse_migrations" ("Id") values ('2023-11-18-08-42-AllOperations');

