#!/usr/bin/env node

import type { WebManglerCliArgs } from "./types";

import yargs from "yargs";

import getVersionMessage from "./version";
import run from "./main";

const versionMessage = getVersionMessage();
const args = yargs(process.argv.slice(2))
  .scriptName("webmangler")
  .usage("$0 [options] <files>")
  .help()
  .version("version", versionMessage)
  .options({
    "config": {
      alias: "c",
      demandOption: false,
      describe: "Choose a configuration file",
      normalize: true,
      type: "string",
    },
    "write": {
      alias: "w",
      demandOption: false,
      describe: "Write changes to input files",
      type: "boolean",
    },
  })
  .argv;

run(args as unknown as WebManglerCliArgs);