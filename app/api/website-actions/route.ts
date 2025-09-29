import { NextResponse, type NextRequest } from "next/server";
import ms from "ms";
import { Sandbox } from "@vercel/sandbox";

const memoryCache = new Map<string, Record<string, unknown>>();

async function runSandbox(url: string) {
  if (memoryCache.has(url)) {
    return memoryCache.get(url);
  }

  const sandbox = await Sandbox.create({
    source: {
      url: "https://github.com/WebCloud/qatech_stagehand.git",
      type: "git",
    },
    resources: { vcpus: 4 },
    timeout: ms("10m"),
    ports: [3000],
    runtime: "node22",
  });

  console.log(`Installing dependencies...`);
  const install = await sandbox.runCommand({
    cmd: "npm",
    args: ["install", "--loglevel", "info"],
    stderr: process.stderr,
    stdout: process.stdout,
  });

  if (install.exitCode != 0) {
    console.log("installing packages failed");
    process.exit(1);
  }

  const build = await sandbox.runCommand({
    cmd: "npm",
    args: ["run", "build"],
    stderr: process.stderr,
    stdout: process.stdout,
  });

  if (build.exitCode != 0) {
    console.log("build command failed");
    process.exit(1);
  }

  console.log(`Starting the development server...`);
  console.log(url);
  const output = await sandbox.runCommand({
    cmd: "node",
    args: ["dist/index.js"],
    stderr: process.stderr,
    stdout: process.stdout,
    detached: false,
    env: {
      BROWSERBASE_API_KEY: process.env.BROWSERBASE_API_KEY!,
      BROWSERBASE_PROJECT_ID: process.env.BROWSERBASE_PROJECT_ID!,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY!,
      URL: url,
    },
  });

  if (output.exitCode != 0) {
    console.log("running node program failed");
    process.exit(1);
  }

  const stdout = await output.output("stdout");

  const parsedOutput = JSON.parse(stdout);
  memoryCache.set(url, parsedOutput);

  return parsedOutput;
}

export const revalidate = 600;

export async function GET(request: NextRequest) {
  let output: Record<string, unknown> | undefined;
  try {
    const reqURL = new URL(request.url);
    const url = reqURL.searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        {
          error: "URL missing",
        },
        {
          status: 400,
        }
      );
    }

    output = await runSandbox(url);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Failed to execute",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    data: output,
  });
}
