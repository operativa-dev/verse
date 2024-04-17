/// setup
import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { boolean, entity, int, string } from "@operativa/verse/model/builder";

const db = verse({
  config: {
    driver: sqlite("todos.sqlite"),
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
