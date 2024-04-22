// noinspection JSUnusedLocalSymbols

import { EntityType, verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import {
  boolean,
  entity,
  int,
  many,
  one,
  string,
} from "@operativa/verse/model/builder";

/// user
const User = entity({
  id: int(),
  name: string(),
  email: string(),
});
///

/// type
type UserType = EntityType<typeof db.entities.users>;
///

/// model
const db = verse({
  config: {
    driver: sqlite("todos.sqlite"), // ...
  },
  model: {
    entities: {
      users: User,
    },
  },
});
///

{
  /// column
  const User = entity({
    id: int({ column: "user_id" }),
    name: string(),
    email: string(),
  });
  ///
}

{
  /// length
  const User = entity({
    id: int(),
    name: string({ maxLength: 255 }),
    email: string(),
  });
  ///
}

{
  /// key
  const User = entity(
    {
      id: int(),
      name: string(),
      email: string(),
    },
    e => e.key("id")
  );
  ///
}

{
  /// table
  const User = entity(
    {
      id: int(),
      name: string(),
      email: string(),
    },
    e => e.table("users")
  );
  ///
}

{
  /// concurrency
  const User = entity(
    {
      //...
      token: int(),
    },
    e => e.concurrency({ version: "token" })
  );
  ///
}

{
  /// condition
  const User = entity(
    {
      //...
      deleted: boolean(),
    },
    e => e.condition(user => !user.deleted)
  );
  ///
}

{
  /// seed-data
  const User = entity(
    {
      id: int(),
      name: string(),
      email: string(),
    },
    e =>
      e.data(
        { id: 1, name: "John", email: "john@example.com" },
        { id: 2, name: "Jane", email: "jane@example.com" }
      )
  );
  ///
}

{
  /// navigations
  const Post = entity({
    id: int(),
    title: string(),
    content: string(),
  });

  const User = entity({
    id: int(),
    name: string(),
    email: string(),
    posts: many(Post),
  });
  ///
}

{
  /// fks-1
  const User = entity({
    id: int(),
    //...
  });

  const Post = entity(
    {
      id: int(),
      userId: int(),
      //...
    },
    e => e.references(User)
  );
  ///
}

{
  /// fks-2
  const User = entity({
    id: int(),
    //...
  });

  const Post = entity(
    {
      id: int(),
      userFk: int(),
      //...
    },
    e => e.references(User, "userFk")
  );
  ///
}

{
  /// class
  class User {
    constructor(
      readonly id: number,
      public name: string,
      public email: string
    ) {}
  }

  const user = entity(User, {
    id: int(),
    name: string(),
    email: string(),
  });
  ///
}

{
  /// circular
  type PostType = {
    readonly id: number;
    userId: number;
  };

  const User = entity({
    id: int(),
    posts: many<PostType>("Post"),
  });

  const Post = entity({
    id: int(),
    userId: int(),
    user: one(User),
  });

  const db = verse({
    config: {
      driver: sqlite("todos.sqlite"), // ...
    },
    model: {
      entities: {
        users: User,
        posts: Post,
      },
    },
  });
  ///
}

{
  /// shadow
  class User {
    constructor(
      readonly id: number,
      public name: string
    ) {}
  }

  const user = entity(
    User,
    {
      id: int(),
      name: string(),
      version: int(),
    },
    e => e.concurrency({ version: "version" })
  );
  ///
}
