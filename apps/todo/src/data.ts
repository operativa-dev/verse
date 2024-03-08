import { EntityType, verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { boolean, entity, int, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

export const db = verse({
  config: {
    driver: sqlite("todos.sqlite"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      todos: entity(
        {
          id: int(),
          title: string(),
          completed: boolean(),
        },
        e => e.table("Todo")
      ),
    },
  },
});

export type Todo = EntityType<typeof db.entities.todos>;
