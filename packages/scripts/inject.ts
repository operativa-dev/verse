import * as fs from "fs";
import { glob } from "glob";
import * as path from "path";

type Annotation = {
  filename: string;
  start: number;
  end: number;
};

const tryParseAnnotation = (text: string): Annotation | null => {
  const match = text.match(/^```ts include (.*)(?::([0-9]+)-([0-9]+))?/);
  if (!match) {
    return null;
  }

  return {
    filename: match[1] ?? "",
    start: Number(match[2] ?? 1),
    end: Number(match[3] ?? 400),
  };
};

const extractSnippet = (annotation: Annotation) => {
  const srcLines = fs.readFileSync(annotation.filename, "utf-8").split("\n");

  return srcLines.slice(annotation.start - 1, annotation.end - 1);
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

const files = await glob("**/*.md", {
  cwd: rootDir,
  ignore: ["packages/scripts/**", "node_modules/**"],
});

// Process each markdown file
files.forEach(file => {
  const filePath = path.join(rootDir, file);

  //console.log(`Reading ${filePath}...`);

  const mdLines = fs.readFileSync(filePath, "utf-8").split("\n");
  let lineIndex = 0;
  let modified = false;
  while (lineIndex < mdLines.length) {
    const [, codeBlockMarker] = (mdLines[lineIndex] ?? "").match(/^(`{3,})/) ?? [];
    if (!codeBlockMarker) {
      // no code block in this line
      lineIndex++;
      continue;
    }

    const annotation = tryParseAnnotation(mdLines[lineIndex] ?? "");
    if (!annotation) {
      // no annotation in this line. This is the case for almost all lines.
      lineIndex++;
      continue;
    }

    const endBlockIndex =
      mdLines.slice(lineIndex + 1).findIndex(l => l === codeBlockMarker) + lineIndex + 1;

    const resolvedFilename = path.resolve(rootDir, annotation.filename);
    if (!fs.existsSync(resolvedFilename)) {
      console.error(
        `Source file (${resolvedFilename}) not found from annotation ${JSON.stringify(
          annotation
        )} in ${filePath}#L${lineIndex + 1}.`
      );
      process.exit(1);
    }

    const snippet = trimEmptyLines(extractSnippet({ ...annotation, filename: resolvedFilename }));

    // handle escaping of backticks inside the snippet
    const blockBraces = getCodeBlockEscape(snippet);
    mdLines[lineIndex] = (mdLines[lineIndex] ?? codeBlockMarker).replace(
      codeBlockMarker,
      blockBraces
    );
    mdLines[endBlockIndex] = (mdLines[endBlockIndex] ?? codeBlockMarker).replace(
      codeBlockMarker,
      blockBraces
    );

    // replace the code block with the snippet
    mdLines.splice(lineIndex + 1, endBlockIndex - lineIndex - 1, ...snippet);

    modified = true;
    lineIndex += snippet.length + 1;
  }

  if (modified) {
    // overwrite the file with the latest version
    fs.writeFileSync(filePath, mdLines.join("\n"), "utf-8");
    console.info(`Updated: ${filePath}`);
  }
});
