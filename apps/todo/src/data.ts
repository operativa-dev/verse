import { verse } from "@operativa/verse";
import { sqlite } from "@operativa/verse-sqlite";
import { boolean, entity, int, string } from "@operativa/verse/model/builder";
import { PrettyConsoleLogger } from "@operativa/verse/utils/logging";

export class Todo {
  public readonly id!: number;

  constructor(public title: string) {}

  completed: boolean = false;
}

export const db = verse({
  config: {
    driver: sqlite("todos.sqlite"),
    logger: new PrettyConsoleLogger(),
  },
  model: {
    entities: {
      todos: entity(
        Todo,
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
