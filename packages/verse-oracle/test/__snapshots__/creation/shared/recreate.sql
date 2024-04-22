-- Executing SQL: Parameters: [$1='CREATION']
select 1 from all_users where username = :0

-- Executing SQL: Parameters: []
drop user creation cascade

-- Executing SQL: Parameters: []
create user creation identified by creation

-- Executing SQL: Parameters: []
grant create session to creation

-- Executing SQL: Parameters: []
grant create table to creation

-- Executing SQL: Parameters: []
grant create sequence to creation

-- Executing SQL: Parameters: []
grant unlimited tablespace to creation

-- Executing SQL: Parameters: []
create table Album (
  AlbumId integer not null,
  Title varchar(160) not null,
  artist_id integer not null,
  primary key (AlbumId)
)

-- Executing SQL: Parameters: []
create table artist (
  ArtistId integer not null,
  Name varchar(255) not null,
  primary key (ArtistId)
)

-- Executing SQL: Parameters: []
create table AllTypes (
  N1 numeric(10, 2) not null,
  N2 numeric(18, 4) not null,
  S1 varchar(255) not null,
  S2 varchar(42) not null,
  S3 clob not null,
  I integer not null,
  Uuid raw(16) not null,
  Bool number(1) not null,
  "Date" timestamp with time zone not null,
  shadow varchar(255) not null,
  primary key (N1)
)

-- Executing SQL: Parameters: []
create table B (
  Foo integer not null,
  primary key (Foo)
)

-- Executing SQL: Parameters: []
create table A (
  Pk integer not null,
  Fk integer not null,
  primary key (Pk),
  foreign key (Fk) references B (Foo) on delete cascade
)

-- Executing SQL: Parameters: []
create table Customer (
  Id integer not null,
  Name varchar(255) not null,
  Street varchar(255) not null,
  City varchar(255),
  primary key (Id)
)

-- Executing SQL: Parameters: []
create sequence "__verse_seqhilo" start with 1 increment by 10

