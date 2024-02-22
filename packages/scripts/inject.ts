import * as fs from "fs";
import { glob } from "glob";
import * as path from "path";

type Annotation = {
  filename: string;
  start: number;
  end: number;
};

const tryParseAnnotation = (text: string): Annotation | undefined => {
  const match = text.match(/^```ts include ([^:]+)(?::([0-9]+)-([0-9]+))?/);

  if (!match) {
    return undefined;
  }

  return {
    filename: match[1] ?? "",
    start: Number(match[2] ?? 1),
    end: Number(match[3] ?? 400),
  };
};

const extractSnippet = (annotation: Annotation) => {
  const srcLines = fs.readFileSync(annotation.filename, "utf-8").split("\n");

  return srcLines.slice(annotation.start - 1, annotation.end);
};

const trimEmptyLines = (lines: string[]) => {
  let start = 0;
  while (start < lines.length && (lines[start] ?? "").trim() === "") {
    start++;
  }

  let end = lines.length;
  while (end > 0 && (lines[end - 1] ?? "").trim() === "") {
    end--;
  }

  return lines.slice(start, end);
};

const getCodeBlockEscape = (snippet: string[]) => {
  return snippet.reduce((acc, line) => {
    const match = line.match(/^`{3,}$/);
    return match && match[0].length >= acc.length ? match[0] + "`" : acc;
  }, "```");
};

const rootDir = path.join(process.cwd(), "../..");

const files = await glob(["**/*.md", "**/*.mdx"], {
  cwd: rootDir,
  ignore: ["packages/scripts/**", "node_modules/**"],
});

const watched = process.argv.includes("--watch") ? new Set<string>() : undefined;
const wrote = new Set<string>();

function run() {
  files.forEach(file => {
    const filePath = path.join(rootDir, file);

    //watched?.add(filePath);

    const lines = fs.readFileSync(filePath, "utf-8").split("\n");

    let lineIndex = 0;
    let modified = false;

    while (lineIndex < lines.length) {
      const [, codeBlockMarker] = (lines[lineIndex] ?? "").match(/^(`{3,})/) ?? [];

      if (!codeBlockMarker) {
        lineIndex++;
        continue;
      }

      const annotation = tryParseAnnotation(lines[lineIndex] ?? "");

      if (!annotation) {
        lineIndex++;
        continue;
      }

      const endBlockIndex =
        lines.slice(lineIndex + 1).findIndex(l => l === codeBlockMarker) + lineIndex + 1;

      const resolvedFilename = path.resolve(rootDir, annotation.filename);

      if (!fs.existsSync(resolvedFilename)) {
        console.error(
          `Source file (${resolvedFilename}) not found from annotation ${JSON.stringify(
            annotation
          )} in ${filePath}#L${lineIndex + 1}.`
        );
        process.exit(1);
      }

      watched?.add(resolvedFilename);

      const snippet = trimEmptyLines(extractSnippet({ ...annotation, filename: resolvedFilename }));

      // handle escaping of backticks inside the snippet
      const blockBraces = getCodeBlockEscape(snippet);
      lines[lineIndex] = (lines[lineIndex] ?? codeBlockMarker).replace(
        codeBlockMarker,
        blockBraces
      );
      lines[endBlockIndex] = (lines[endBlockIndex] ?? codeBlockMarker).replace(
        codeBlockMarker,
        blockBraces
      );

      // replace the code block with the snippet
      lines.splice(lineIndex + 1, endBlockIndex - lineIndex - 1, ...snippet);

      modified = true;
      lineIndex += snippet.length + 1;
    }

    if (modified) {
      fs.writeFileSync(filePath, lines.join("\n"), "utf-8");

      console.info(`Updated: ${filePath}`);

      wrote.add(file);
    }
  });
}

wrote.clear();

run();

if (watched) {
  console.info("\nWatching for changes...");

  const chokidar = await import("chokidar");

  let watcher = chokidar.watch([...watched], { cwd: rootDir, ignoreInitial: true });

  watcher.on("change", async file => {
    if (wrote.has(file)) {
      wrote.delete(file);
    } else {
      console.info(`Detected change in '${file}', updating...`);
      run();
    }
  });
}
