import { Application } from "typedoc";
import { FrontmatterEvent } from "typedoc-plugin-frontmatter";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

export function load(app: Application) {
  app.renderer.on(MarkdownPageEvent.END, (event: MarkdownPageEvent) => {
    if (event.contents) {
      event.contents = event.contents
        .replace(/^### Example\n```\n\n/gm, "### Example\n```ts\n")
        .replace(/^```ts\n(.+?)\n+^```/gms, "```ts showLineNumbers\n$1\n```");
    }
  });

  app.renderer.on(FrontmatterEvent.PREPARE_FRONTMATTER, (event: FrontmatterEvent) => {
    event.frontmatter = {
      title: event.page.model?.name,
    };
  });
}
