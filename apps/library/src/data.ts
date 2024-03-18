import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import {
  boolean,
  date,
  entity,
  int,
  string,
} from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

export class User {
  public readonly userId!: number;

  constructor(
    public firstName: string,
    public birthday: Date,
    public active: boolean,
    public isAuthor: boolean
  ) {}
}

export class Book {
  public readonly bookId!: number;

  constructor(public title: string, public description: string) {}
}

export class LibraryInventory {
  public readonly id!: number;

  constructor(public created: Date, public bookId: Book, public userId: User) {}
}

export const db = verse({
  config: {
    driver: sqlite("basic.sqlite"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      users: entity(
        User,
        {
          userId: int(),
          firstName: string(),
          birthday: date(),
          active: boolean(),
          isAuthor: boolean(),
        },
        (t) => {
          t.table("users");
          t.data(
            new User(
              "Will",
              new Date(new Date().setFullYear(new Date().getFullYear() - 20)),
              true,
              false
            ),
            new User(
              "Ben",
              new Date(new Date().setFullYear(new Date().getFullYear() - 19)),
              true,
              false
            ),
            new User(
              "Tolkien",
              new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
              true,
              true
            )
          );
        }
      ),
      books: entity(
        Book,
        {
          bookId: int(),
          title: string(),
          description: string(),
        },
        (t) => {
          t.table("books");
          t.data(
            new Book("Dune", "Space politics about a desert planet"),
            new Book("Moby-Dick", "An epic hunt for the white whale"),
            new Book(
              "Harry Potter and the Philosopher's Stone",
              "Magic world of wizards and mystery"
            )
          );
        }
      ),
      libraryInventory: entity(
        LibraryInventory,
        {
          id: int(),
          created: date(),
          bookId: int(),
          userId: int({ nullable: true }),
        },
        (t) => {
          t.table("libraryInventory");
          t.data(new LibraryInventory(new Date(), 1, null));
        }
      ),
    },
  },
});
