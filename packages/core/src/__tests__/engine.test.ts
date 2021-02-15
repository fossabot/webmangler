import type { TestScenario } from "@webmangler/testing";
import type { ManglerExpression } from "../languages";
import type { CharSet, ManglerFile } from "../types";

import { expect } from "chai";

import ManglerExpressionMock from "../__mocks__/mangler-expression.mock";
import ManglerFileMock from "../__mocks__/mangler-file.mock";

import engine from "../engine";

interface TestCase {
  description?: string;
  expected: ManglerFile[];
  expressions: Map<string, ManglerExpression[]>;
  files: ManglerFile[];
  patterns: string | string[];
  charSet?: CharSet;
  reservedNames?: string[];
  manglePrefix?: string;
}

suite("ManglerEngine", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "one file",
      cases: [
        {
          files: [new ManglerFileMock("css", ".foo { } #bar { }")],
          expected: [new ManglerFileMock("css", ".a { } #bar { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [new ManglerFileMock("css", ".foo { } .cls-bar { }")],
          expected: [new ManglerFileMock("css", ".foo { } .a { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "cls-[a-z]+",
        },
      ],
    },
    {
      name: "multiple file",
      cases: [
        {
          files: [
            new ManglerFileMock("css", ".foo { }"),
            new ManglerFileMock("css", "#bar { }"),
          ],
          expected: [
            new ManglerFileMock("css", ".a { }"),
            new ManglerFileMock("css", "#bar { }"),
          ],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            new ManglerFileMock("css", ".foo { }"),
            new ManglerFileMock("css", ".bar { }"),
          ],
          expected: [
            new ManglerFileMock("css", ".a { }"),
            new ManglerFileMock("css", ".b { }"),
          ],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            new ManglerFileMock("css", ".foo { }"),
            new ManglerFileMock("css", ".foo { } .bar { }"),
          ],
          expected: [
            new ManglerFileMock("css", ".a { }"),
            new ManglerFileMock("css", ".a { } .b { }"),
          ],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
        {
          files: [
            new ManglerFileMock("css", ".foo { }"),
            new ManglerFileMock("html", "<div class=\"cls-foo cls-bar\">"),
          ],
          expected: [
            new ManglerFileMock("css", ".a { }"),
            new ManglerFileMock("html", "<div class=\"cls-a cls-b\">"),
          ],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
            ["html", [new ManglerExpressionMock("cls-(%s)", 1, "cls-%s")]],
          ]),
          patterns: "[a-z]+",
        },
      ],
    },
    {
      name: "custom character set",
      cases: [
        {
          files: [new ManglerFileMock("css", ".another, .one, .bites, .de_dust { }")],
          expected: [new ManglerFileMock("css", ".a, .b, .c, .aa { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z_]+",
          charSet: ["a", "b", "c"],
        },
        {
          files: [new ManglerFileMock("css", ".another, .one, .bites, .de_dust { }")],
          expected: [new ManglerFileMock("css", ".c, .b, .a, .cc { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z_]+",
          charSet: ["c", "b", "a"],
        },
        {
          files: [new ManglerFileMock("css", ".foo { } .bar { }")],
          expected: [new ManglerFileMock("css", ".x { } .xx { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          charSet: ["x"],
        },
      ],
    },
    {
      name: "reserved names",
      cases: [
        {
          files: [new ManglerFileMock("css", ".foo { } .bar { }")],
          expected: [new ManglerFileMock("css", ".a { } .c { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          reservedNames: ["b"],
        },
        {
          files: [new ManglerFileMock("css", ".foo { }")],
          expected: [new ManglerFileMock("css", ".c { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          reservedNames: ["a", "b"],
        },
      ],
    },
    {
      name: "mangling prefix",
      cases: [
        {
          files: [new ManglerFileMock("css", ".foo { } .bar { }")],
          expected: [new ManglerFileMock("css", ".cls-a { } .cls-b { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          manglePrefix: "cls-",
        },
      ],
    },
    {
      name: "reserved names & mangling prefix",
      cases: [
        {
          files: [new ManglerFileMock("css", ".foo { } .bar { }")],
          expected: [new ManglerFileMock("css", ".cls-b { } .cls-c { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          reservedNames: ["a"],
          manglePrefix: "cls-",
        },
      ],
    },
    {
      name: "input files not supported",
      cases: [
        {
          files: [new ManglerFileMock("css", ".foo { }")],
          expected: [],
          expressions: new Map(),
          patterns: "",
        },
        {
          files: [
            new ManglerFileMock("css", ".foo { }"),
            new ManglerFileMock("html", "<p>Hello world!</p>"),
          ],
          expected: [
            new ManglerFileMock("css", ".foo { }"),
          ],
          expressions: new Map([
            ["css", []],
          ]),
          patterns: "",
        },
        {
          files: [
            new ManglerFileMock("css", ".foo { }"),
            new ManglerFileMock("html", "<p>Hello world!</p>"),
          ],
          expected: [
            new ManglerFileMock("html", "<p>Hello world!</p>"),
          ],
          expressions: new Map([
            ["html", []],
          ]),
          patterns: "",
        },
      ],
    },
    {
      name: "mangles based on frequency",
      cases: [
        {
          files: [new ManglerFileMock("css", ".foo, .bar { } .bar { }")],
          expected: [new ManglerFileMock("css", ".b, .a { } .a { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
        },
      ],
    },
    {
      name: "corner cases",
      cases: [
        {
          files: [new ManglerFileMock("css", ".a { }")],
          expected: [new ManglerFileMock("css", ".a { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          description: "no changes expected if source is already mangled",
        },
        {
          files: [new ManglerFileMock("css", ".b { } .a { }")],
          expected: [new ManglerFileMock("css", ".a { } .b { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z]+",
          description: "mangled source may be re-mangled",
        },
        {
          files: [new ManglerFileMock("css", ".a-a { }")],
          expected: [new ManglerFileMock("css", ".a { }")],
          expressions: new Map([
            ["css", [new ManglerExpressionMock("\\.(%s)", 1, ".%s")]],
          ]),
          patterns: "[a-z-]+",
          description: "potential unique prefix can appear in source",
        },
      ],
    },
  ];

  for (const { name, cases } of scenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const { expected, description: failureMessage, files } = testCase;
        const result = engine(files, testCase);
        expect(result).to.deep.equal(expected, failureMessage);
      }
    });
  }
});
