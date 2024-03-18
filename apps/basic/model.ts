import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { boolean, entity, int, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

export const db = verse({
  config: {
    driver: sqlite("basic.sqlite"),
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
        t => {
          t.table("todos");
          t.data(
            {id:1, title: "My first todo", completed: true },
            {id:2, title: "My second todo", completed: false }
          );
        }
      ),
    },
  },
});
