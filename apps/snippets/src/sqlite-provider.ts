/// setup-verse
import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { boolean, entity, int, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

// Setup our Verse instance.

const db = verse({
  config: {
    driver: sqlite("todos.sqlite"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      todos: entity({
        id: int(),
        title: string(),
        completed: boolean(),
      }),
    },
  },
});
///
