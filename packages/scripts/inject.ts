import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import path from "node:path";

const rootDir = path.join(process.cwd(), "../..");

const files = await glob(["**/*.md", "**/*.mdx"], {
  cwd: rootDir,
  ignore: ["packages/scripts/**", "node_modules/**"],
});

const codeRegex = /^(```ts include ([^:\n]+)(?::([a-z-0-9]+)[^\n]*)?\n)(.*?)```/gms;

for (const file of files) {
  const filePath = path.join(rootDir, file);
  const content = await readFile(filePath, { encoding: "utf8" });

  let match;
  let newContent = content;

  while ((match = codeRegex.exec(content)) !== null) {
    const src = match[2]!;
    const name = match[3]!;
    const srcPath = path.resolve(rootDir, src);

    if (!existsSync(srcPath)) {
      console.error(`Source file '${srcPath}' not found! Referenced in: ${filePath}`);
      process.exit(1);
    }

    let snippet = await readFile(srcPath, "utf8");

    if (name) {
      const snippetRegex = new RegExp(`\\/\\/\\/ ${name}\\n([\\s\\S]+?)\\/\\/\\/`, "gm");

      const snippetMatch = snippetRegex.exec(snippet);

      if (!snippetMatch) {
        console.error(
          `Snippet '${name}' not found in '${srcPath.replace(rootDir, "")}'. ` +
            `Referenced in: '${filePath.replace(rootDir, "")}' at '${match[0].split("\n")[0]}'`
        );
        process.exit(1);
      }

      snippet = snippetMatch[1]!;
    } else {
      snippet = snippet.replace(/\/\/\/ ?[a-z-0-9]*\n/g, "");
    }

    newContent = newContent.replace(match[0]!, match[1] + snippet + "```");
  }

  if (newContent !== content) {
    await writeFile(filePath, newContent);

    console.log(`Updated ${filePath}`);
  }
}
