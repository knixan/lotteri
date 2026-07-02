#!/usr/bin/env node
// Windows PATH changes from installers don't always propagate to already-open
// terminals/IDEs. Rather than depend on `java` resolving correctly on PATH,
// find a JDK 21+ install ourselves and use it explicitly for this process.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const MIN_JAVA_MAJOR = 21;

function javaMajorVersion(javaBin) {
  const result = spawnSync(javaBin, ["-version"], { encoding: "utf8" });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  const match = output.match(/version "(\d+)/);
  return match ? Number(match[1]) : null;
}

function findJdk21Plus() {
  const roots = [
    "C:\\Program Files\\Eclipse Adoptium",
    "C:\\Program Files\\Java",
    path.join(process.env.LOCALAPPDATA ?? "", "Programs", "Eclipse Adoptium"),
  ].filter((root) => root && existsSync(root));

  const candidates = roots.flatMap((root) =>
    readdirSync(root)
      .map((name) => name.match(/^jdk-(\d+)/))
      .filter(Boolean)
      .map((match) => ({ root, name: match.input, major: Number(match[1]) }))
  );

  const best = candidates
    .filter((c) => c.major >= MIN_JAVA_MAJOR)
    .sort((a, b) => b.major - a.major)[0];

  return best ? path.join(best.root, best.name, "bin") : null;
}

const env = { ...process.env };
// process.env's PATH lookup is case-insensitive on Windows (it's "Path", not
// "PATH"), but a plain spread loses that: `env.PATH = ...` would silently
// create a second, conflicting key instead of updating the real one.
const pathKey = Object.keys(env).find((key) => key.toLowerCase() === "path") ?? "PATH";
const currentMajor = javaMajorVersion("java");

if (currentMajor === null || currentMajor < MIN_JAVA_MAJOR) {
  const jdkBin = findJdk21Plus();
  if (jdkBin) {
    console.log(`[emulators] PATH has Java ${currentMajor ?? "none"}; using JDK at ${jdkBin} instead.`);
    env[pathKey] = `${jdkBin}${path.delimiter}${env[pathKey] ?? ""}`;
  } else {
    console.warn(
      `[emulators] No JDK ${MIN_JAVA_MAJOR}+ found. Install one (e.g. Eclipse Temurin) and try again.`
    );
  }
}

const result = spawnSync("npx", ["firebase", "emulators:start"], {
  stdio: "inherit",
  env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
