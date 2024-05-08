import { Application } from "typedoc";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

export function load(app: Application) {
  app.renderer.on(MarkdownPageEvent.END, (event: MarkdownPageEvent) => {
    if (event.contents) {
      event.contents = event.contents
        .replace(/^### Example\n```\n\n/gm, "### Example\n```ts\n")
        .replace(/^```ts\n(.+?)\n+^```/gms, "```ts showLineNumbers\n$1\n```");
    }
  });

  app.renderer.on(MarkdownPageEvent.BEGIN, (event: MarkdownPageEvent) => {
    event.frontmatter = {
      title: event.model?.name,
    };
  });
}
