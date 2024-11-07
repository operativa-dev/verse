import { exec } from "child_process";
import * as fs from "fs";
import { promisify } from "util";

type Install = (
  dependencies: string | string[],
  options?: { stdout?: NodeJS.WriteStream & { fd: 1 }; stderr?: NodeJS.WriteStream & { fd: 2 } }
) => Promise<void>;

const install =
  (command: string, cwd: string): Install =>
  async (
    dependencies: string | string[],
    options: {
      stdout?: NodeJS.WriteStream & { fd: 1 };
      stderr?: NodeJS.WriteStream & { fd: 2 };
    } = {}
  ) => {
    return new Promise<void>(async (resolve, reject) => {
      const deps = Array.isArray(dependencies) ? dependencies : [dependencies];
      const cmd = `${command} ${deps.join(" ")}`;
      if (options.stdout) {
        const wr = promisify(options.stdout.write).bind(options.stdout);
        await wr(`Installing: ${deps.map(dep => dep + "\n            ")}\n`);
        await wr(`  by executing: ${cmd}\n`);
      }
      const proc = exec(cmd, { cwd }, err => {
        if (err) return reject(err);
        resolve();
      });
      if (options.stdout) proc.stdout?.pipe(options.stdout);
      if (options.stderr) proc.stderr?.pipe(options.stderr);
    });
  };

/**
 * Detects which package manager is being used for this package and returns the appropriate install function.
 * @returns
 */
export const whichPackageManager = (path: string) => {
  let installCmd;
  const agentstr = process.env["npm_config_user_agent"];
  if (
    agentstr?.startsWith("pnpm") ||
    agentstr?.startsWith("pnpx") ||
    fs.existsSync("pnpm-lock.yaml")
  ) {
    installCmd = "pnpm install";
  } else if (agentstr?.startsWith("yarn") || fs.existsSync("yarn.lock")) {
    installCmd = "yarn add";
  } else if (
    agentstr?.startsWith("npm") ||
    agentstr?.startsWith("npx") ||
    fs.existsSync("package-lock.json")
  ) {
    installCmd = "npm install";
  } else {
    throw new Error("Unable to detect package manager.");
  }
  return install(installCmd, path);
};
