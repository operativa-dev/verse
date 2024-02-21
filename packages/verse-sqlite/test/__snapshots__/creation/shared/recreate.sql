-- Executing SQL: Parameters: []
create table "Album" (
  "AlbumId" integer not null,
  "Title" varchar(160) not null,
  "artist_id" integer not null,
  primary key ("AlbumId")
)

-- Executing SQL: Parameters: []
create table "artist" (
  "ArtistId" integer not null,
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
  "Uuid" text not null,
  "Bool" boolean not null,
  "Date" timestamp not null,
  "shadow" varchar(255) not null,
  primary key ("N1")
)

-- Executing SQL: Parameters: []
create table "B" (
  "Foo" integer not null,
  primary key ("Foo")
)

-- Executing SQL: Parameters: []
create table "A" (
  "Pk" integer not null,
  "Fk" integer not null,
  primary key ("Pk"),
  foreign key ("Fk") references "B" ("Foo") on delete cascade
)

-- Executing SQL: Parameters: []
create table "Customer" (
  "Id" integer not null,
  "Name" varchar(255) not null,
  "Street" varchar(255) not null,
  "City" varchar(255),
  primary key ("Id")
)

