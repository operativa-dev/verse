-- Executing SQL: Parameters: [$1='creation']
select 1
from "sys"."databases"
where "name" = @p0

-- Executing SQL: Parameters: []
drop database "creation"

-- Executing SQL: Parameters: []
create database "creation"

-- Executing SQL: Parameters: []
create table "Album" (
  "AlbumId" integer not null identity,
  "Title" varchar(160) not null,
  "artist_id" integer not null,
  primary key ("AlbumId")
)

-- Executing SQL: Parameters: []
create table "artist" (
  "ArtistId" integer not null identity,
  "Name" varchar(255) not null,
  primary key ("ArtistId")
)

-- Executing SQL: Parameters: []
create table "AllTypes" (
  "N1" numeric(10, 2) not null,
  "N2" numeric(18, 4) not null,
  "S1" varchar(255) not null,
  "S2" varchar(42) not null,
  "S3" text not null,
  "I" integer not null,
  "Uuid" uniqueidentifier not null,
  "Bool" bit not null,
  "Date" datetimeoffset not null,
  "shadow" varchar(255) not null,
  primary key ("N1")
)

-- Executing SQL: Parameters: []
create table "B" (
  "Foo" integer not null identity,
  primary key ("Foo")
)

-- Executing SQL: Parameters: []
create table "A" (
  "Pk" integer not null identity,
  "Fk" integer not null,
  primary key ("Pk"),
  foreign key ("Fk") references "B" ("Foo") on delete cascade
)

-- Executing SQL: Parameters: []
create table "Customer" (
  "Id" integer not null identity,
  "Name" varchar(255) not null,
  "Street" varchar(255) not null,
  "City" varchar(255),
  primary key ("Id")
)

