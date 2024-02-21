# Verse: Powerful TypeScript Data Access

[![Version Alpha](https://img.shields.io/badge/version-alpha-red)](https://github.com/operativa-dev)

## Introduction

Verse is a new data access package for TypeScript, developed by [Operativa](http://operativa.dev). Sparked by a dissatisfaction with the popular data access options available in the JavaScript ecosystem, Verse aims to provide the JS community with a robust and efficient way to work with data in their applications. It borrows from the best practices of popular O/RMs on other platforms like Entity Framework Core for .NET, while also taking advantage of the unique features of TypeScript.

## Features Overview

- **Type-Safe:** [LINQ](https://learn.microsoft.com/en-us/dotnet/csharp/linq/)-like queries, authored in pure TypeScript with full type-checking and tooling support.
- **Efficient:** Queries can be compiled and are async iterable. Updates use Unit of Work with change tracking, pipelining and partial updates.
- **Safe:** SQL is always parameterized and escaped, so you don't have to worry about SQL injection attacks.
- **Flexible:** Supports a variety of database drivers, and can be used with any database that has a Node.js driver.
- **Powerful:** Rich query operators, eager-loading, identity generation, schema creation, change-tracking, metadata model, and more.

## Getting Started

### 1. Declare Entities

Entities are classes corresponding to the business objects in you application domain. Here we are modelling a music
database, so we will create two entities: _Artist_ and _Album_:

```typescript
class Artist {
  constructor(
    readonly artistId: number,
    public name: string,
    readonly albums: Album[]
  ) {}
}

class Album {
  readonly albumId: number;
  constructor(
    public title: string,
    public artistId: number
  ) {}
}
```

### 2. Create a Verse Object

A "verse" is the top-level object that we use to interact with our data. It holds our configuration, like the database
driver we want to use, and our model, which is a collection of entity models, specified via a type-safe DSL API.

```typescript
const verse = verse({
  config: { driver: new SqliteDriver("Chinook.sqlite") },
  model: {
    artists: entity(Artist, a => {
      a.properties({
        artistId: int(),
        name: string(),
        albums: many(Album),
      });
    }),

    albums: entity(Album, a => {
      a.properties({
        albumId: int(),
        title: string(),
        artistId: int(),
      });
    }),
  },
});
```

> 💡 **Tip:** We are using the open-source Chinook database for our example. You can download
> it [here](https://github.com/lerocha/chinook-database).

### 3. Our First Query

Now that we have our entities and our verse object, we can start querying our database. Let's get all of the albums in our
database:

```typescript
const albums = await verse.from.albums.toArray();
```

which produces:

```js
[
  {
    albumId: 1,
    title: "For Those About To Rock We Salute You",
    artistId: 1,
  },
  {
    albumId: 2,
    title: "Balls to the Wall",
    artistId: 2,
  },
  //...
];
```

> 💡 **Tip:** We use `toArray` to buffer results. Verse queries are also async iterable, so we can use `for await` to
> asynchronously stream results.

How many albums are there?

```typescript
const count = await verse.from.albums.count();
```

which produces:

```js
347;
```

And the SQL that Verse used to realise this query:

```sql
select count(*)
from (
   select "t0"."AlbumId", "t0"."Title", "t0"."ArtistId"
   from "Album" as "t0"
) as "t1"
```

> 💡 **Tip:** Our generated SQL is not being optimized yet. We are working on it!

Verse supports many query operators,
like `where`, `select`, `orderBy`, `offset`, `limit`, `groupBy`, `join`, `any`, `all`, `first`, and more. You can
find a complete list of operators in the [API Reference](https://github.com/operativa-dev).

For example:

```typescript
const albums = await verse.from.albums
  .where(a => a.title.like("A%"))
  .select(a => a.title)
  .orderBy(t => t)
  .offset(10)
  .limit(5)
  .toArray();
```

which produces:

```js
[
  "Acústico MTV",
  "Acústico MTV [Live]",
  "Adams, John: The Chairman Dances",
  "Adorate Deum: Gregorian Chant from the Proper of the Mass",
  "Afrociberdelia",
];
```

What if we want to query an Artist with their associated Albums? Verse supports eager-loading via the `with` query operator:

```typescript
const miles = await verse.from.artists
  .with(a => a.albums)
  .where(a => a.name === "Miles Davis")
  .toArray();
```

which produces:

```js
[
  {
    artistId: 68,
    name: "Miles Davis",
    albums: [
      {
        albumId: 48,
        title: "The Essential Miles Davis [Disc 1]",
        artistId: 68,
      },
      {
        albumId: 49,
        title: "The Essential Miles Davis [Disc 2]",
        artistId: 68,
      },
      {
        albumId: 157,
        title: "Miles Ahead",
        artistId: 68,
      },
    ],
  },
];
```

What about query parameters? Verse supports a couple of methods of query parameterization:

The first is _Compiled Queries_, which is a way to pre-compile a query and then execute it multiple times with different parameters. Compiled queries are efficient because the cost of processing the query is only incurred once, and the query can be cached for future use:

```typescript
const query = verse.compile((from, $title: string) =>
  from.albums
    .where(a => a.title == $title)
    .select(a => `Title: ${a.title}!`)
    .single()
);

const result = await query("Miles Ahead");
```

which produces:

```js
"Title: Miles Ahead!";
```

The second is _Operator-Local Parameters_, which is a way to parameterize a query operator in-place, avoiding the need to create a compiled query. This is useful for simple or infrequently run queries that you don't want to create a compiled query for:

```typescript
const title = "Miles Ahead";

const result = await verse.from.albums
  .where((a, $title: string) => a.title === $title, title)
  .select(a => `Title: ${a.title}!`)
  .single();
```

> 💡 **Tip:** Queries produced by Verse are always parameterized (and prepared where possible), so you don't have to worry about SQL injection attacks.

## Updating Data

Verse supports the [Unit of Work](https://martinfowler.com/eaaCatalog/unitOfWork.html) pattern for updates, and will automatically track changes to entities that you load from the database. For example:

```typescript
const uow = verse.uow();
const album = await uow.albums.where(a => a.title === "Miles Ahead").single();

album.title = "Miles Ahead - Remastered";

await uow.commit();
```

When we call `commit`, Verse will generate the necessary SQL to update the database:

```sql
-- Executing SQL: Parameters: [$1='Miles Ahead - Remastered', $2=68, $3=157]
update "Album" set "Title" = ?, "ArtistId" = ? where "AlbumId" = ?
```

We can also create new objects:

```typescript
const album = new Album("Miles Ahead - Remastered", 68);
const uow = verse.uow();

await uow.albums.add(album);

await uow.commit();
```

and remove existing ones:

```typescript
const uow = verse.uow();
const album = await uow.albums.where(a => a.title === "Miles Ahead - Remastered").single();

uow.albums.remove(album);

await uow.commit();
```

> 💡 **Tip:** Unit of work commits are transactional, so if an error occurs during the commit, the transaction will be rolled back.

## Installation

TODO!

## Development Status

Please note that "Verse" is in its early development and the presented version is an alpha release. It's intended to be
a preview for select developers. We appreciate bug reports and improvement suggestions as we continue to refine and
enhance this library.

## Contribution Guidelines

To learn how you can contribute to this project, please check our [Contribution Guide](https://github.com/operativa-dev).

## Versioning

TODO

## License

Our project is released under the MIT license. For more information, see the LICENSE file in our repository.
