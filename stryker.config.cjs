"use strict";

const values = require("./.values.cjs");

const {
  packagesCoverageExclusions,
  packagesDir,
  packagesExpr,
  packagesList,
  reportsDir,
  srcDir,
  tempDir,
  testsDir,
} = values;

module.exports = {
  coverageAnalysis: "perTest",
  inPlace: false,
  mutate: [
    `${packagesDir}/${packagesExpr}/${srcDir}/**/*.ts`,
    `!**/${testsDir}/**/*.ts`,
    ...packagesCoverageExclusions.map((exclusion) => `!${exclusion}`),
  ],
  commandRunner: {
    command: `npm run test -- ${packagesList.join(" ")} --unit`,
  },

  timeoutMS: 25000,
  timeoutFactor: 2.5,

  disableTypeChecks: `${packagesDir}/${packagesExpr}/${srcDir}/**/*.ts`,
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.build.json",

  reporters: [
    "clear-text",
    "dashboard",
    "html",
    "progress",
  ],
  dashboard: {
    module: packagesList[0],
  },
  htmlReporter: {
    fileName: `${reportsDir}/mutation/index.html`,
  },
  thresholds: {
    high: 80,
    low: 70,
    break: 50,
  },

  tempDirName: `${tempDir}/stryker`,
  cleanTempDir: false,
};
