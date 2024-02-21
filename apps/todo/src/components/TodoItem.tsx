"use client";

import { Todo } from "@/data";
import { toggleTodo } from "@/server";

export function TodoItem(todo: Todo) {
  return (
    <li className="flex gap-1 items-center">
      <input
        id={todo.id.toString()}
        type="checkbox"
        className="cursor-pointer peer"
        defaultChecked={todo.completed}
        onChange={e => toggleTodo(todo.id, e.target.checked)}
      />
      <label
        htmlFor={todo.id.toString()}
        className="cursor-pointer peer-checked:line-through peer-checked:text-slate-500"
      >
        {todo.title}
      </label>
    </li>
  );
}
