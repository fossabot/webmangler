import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import NestedGroupMangleExpression from "../../nested-group.class";

suite("NestedGroupMangleExpression", function() {
  test("without the capturing group in template", function() {
    const expectedMessage = "Missing CAPTURE_GROUP from patternTemplate";

    expect(() => {
      new NestedGroupMangleExpression({
        patternTemplate: "",
        subPatternTemplate: NestedGroupMangleExpression.SUB_CAPTURE_GROUP,
      });
    }).to.throw(expectedMessage);
  });

  test("without the capturing group in sub template", function() {
    const expectedMessage = "Missing SUB_CAPTURE_GROUP from subPatternTemplate";

    expect(() => {
      new NestedGroupMangleExpression({
        patternTemplate: NestedGroupMangleExpression.CAPTURE_GROUP({
          before: "foo",
          after: "bar",
        }),
        subPatternTemplate: "",
      });
    }).to.throw(expectedMessage);
  });

  suite("::findAll", function() {
    type TestCase = Iterable<{
      patternTemplate: string;
      subPatternTemplate: string;
      caseSensitive?: boolean;
      pattern: string;
      s: string;
      expected: string[];
    }>;

    const scenarios: TestScenarios<TestCase> = [
      {
        testName: "sample",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "var pw = 'correct horse battery staple';",
            expected: ["horse", "battery"],
          },
          {
            patternTemplate: `
              (?<=class=")
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^\"]*", after: "[^\"]*" })}
              (?=")
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "cls-[a-z]+",
            s: "<img class=\"cls-foo cls-bar\">",
            expected: ["cls-foo", "cls-bar"],
          },
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "data-[a-z]+",
            s: "<div data-foo=\"bar\" id=\"3\" data-bar></div>",
            expected: ["data-foo", "data-bar"],
          },
        ],
      },
      {
        testName: "default case sensitivity",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            pattern: "data-[a-z]+",
            s: "<div data-foo=\"bar\" id=\"3\" data-bar></div>",
            expected: ["data-foo", "data-bar"],
          },
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            pattern: "[A-Za-z]+",
            s: "var pw = 'Correct Horse Battery Staple';",
            expected: ["Horse", "Battery"],
          },
        ],
      },
      {
        testName: "patterns with newlines",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `,
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "var pw = 'correct horse battery staple';",
            expected: ["horse", "battery"],
          },
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `,
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "var pw = 'correct horse battery staple';",
            expected: ["horse", "battery"],
          },
        ],
      },
      {
        testName: "case sensitive",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "data-[A-Za-z]+",
            s: "<div data-foo=\"bar\" id=\"3\" data-BAR></div>",
            expected: ["data-foo", "data-BAR"],
          },
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "data-[A-Za-z]+",
            s: "<div data-Foo=\"bar\" id=\"3\" data-Bar></div>",
            expected: ["data-Foo", "data-Bar"],
          },
        ],
      },
      {
        testName: "case insensitive",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: false,
            pattern: "data-[a-z]+",
            s: "<div data-foo=\"bar\" id=\"3\" data-BAR></div>",
            expected: ["data-foo", "data-bar"],
          },
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: false,
            pattern: "data-[a-z]+",
            s: "<div data-Foo=\"bar\" id=\"3\" data-Bar></div>",
            expected: ["data-foo", "data-bar"],
          },
        ],
      },
      {
        testName: "matching another group",
        getScenario: () => [
          {
            patternTemplate: `
              (
                \\/\\*.*?\\*\\/
                |
                ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "", after: "" })}
              )
            `.replace(/\s/g, ""),
            subPatternTemplate: NestedGroupMangleExpression.SUB_CAPTURE_GROUP,
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "/*foobaz*/foobar",
            expected: ["foobar"],
          },
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (
                horse
                |
                (
                  (?<=\\s)
                  ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
                  (?=\\s)
                )
              )
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "var pw = 'correct horse battery staple';",
            expected: ["battery"],
          },
        ],
      },
      {
        testName: "corner cases",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "",
            expected: [],
          },
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            pattern: "[a-z]+",
            s: "var m = new Map();",
            expected: [],
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            subPatternTemplate,
            caseSensitive,
            pattern,
            s,
            expected,
          } = testCase;

          const subject = new NestedGroupMangleExpression({
            patternTemplate,
            subPatternTemplate,
            caseSensitive,
          });

          let i = 0;
          for (const str of subject.findAll(s, pattern)) {
            expect(str).to.equal(expected[i]);
            i++;
          }

          expect(i).to.equal(expected.length, `in ${s}`);
        }
      });

      test(`${testName}, with groupName`, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            subPatternTemplate,
            caseSensitive,
            pattern,
            s,
            expected,
          } = testCase;

          const groupName = "g";

          const subject = new NestedGroupMangleExpression({
            patternTemplate: patternTemplate.replace(
              "NestedGroupMangleExpressionCapturingGroup",
              groupName,
            ),
            subPatternTemplate: subPatternTemplate.replace(
              NestedGroupMangleExpression.SUB_CAPTURE_GROUP,
              `(?<${groupName}>%s)`,
            ),
            groupName,
            caseSensitive,
          });

          let i = 0;
          for (const str of subject.findAll(s, pattern)) {
            expect(str).to.equal(expected[i]);
            i++;
          }

          expect(i).to.equal(expected.length, `in ${s}`);
        }
      });
    }
  });

  suite("::replaceAll", function() {
    type TestCase = Iterable<{
      patternTemplate: string;
      subPatternTemplate: string;
      caseSensitive: boolean;
      replacements: Map<string, string>;
      s: string;
      expected: string;
    }>;

    const scenarios: TestScenarios<TestCase> = [
      {
        testName: "sample",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["horse", "zebra"],
              ["battery", "cell"],
            ]),
            s: "var pw = 'correct horse battery staple';",
            expected: "var pw = 'correct zebra cell staple';",
          },
          {
            patternTemplate: `
              (?<=class=")
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^\"]*", after: "[^\"]*" })}
              (?=")
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["cls-foo", "a"],
              ["cls-foobar", "b"],
              ["cls-bar", "c"],
            ]),
            s: "<img class=\"cls-foo cls-bar\">",
            expected: "<img class=\"a c\">",
          },
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
              ["data-foobar", "data-c"],
            ]),
            s: "<div data-foo=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
          {
            patternTemplate: `
              (?<=\\<)[a-z]+\\s
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
            ]),
            s: "<div data-foo=\"bar\" data-bar=\"foo\"></div>",
            expected: "<div data-a=\"bar\" data-b=\"foo\"></div>",
          },
        ],
      },
      {
        testName: "case sensitive",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["data-FOO", "data-a"],
              ["data-bar", "data-b"],
            ]),
            s: "<div data-FOO=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-BAR", "data-b"],
            ]),
            s: "<div data-foo=\"bar\" id=\"3\" data-BAR></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["data-FOO", "data-a"],
              ["data-BAR", "data-b"],
            ]),
            s: "<div data-FOO=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-bar></div>",
          },
        ],
      },
      {
        testName: "case insensitive",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: false,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
            ]),
            s: "<div data-FOO=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: false,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
            ]),
            s: "<div data-foo=\"bar\" id=\"3\" data-BAR></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
          {
            patternTemplate: `
              (?<=\\<[a-z]+\\s)
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^>]*", after: "[^>]*" })}
              (?=\\>)
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=^|\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=$|\\s|\\=)
            `.replace(/\s/g, ""),
            caseSensitive: false,
            replacements: new Map([
              ["data-foo", "data-a"],
              ["data-bar", "data-b"],
            ]),
            s: "<div data-FOO=\"bar\" id=\"3\" data-bar></div>",
            expected: "<div data-a=\"bar\" id=\"3\" data-b></div>",
          },
        ],
      },
      {
        testName: "matching another group",
        getScenario: () => [
          {
            patternTemplate: `
              (
                \\/\\*.*?\\*\\/
                |
                ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "foo", after: "" })}
              )
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
            `,
            caseSensitive: true,
            replacements: new Map([
              ["bar", "baz"],
            ]),
            s: "/*foobar*/foobar",
            expected: "/*foobar*/foobaz",
          },
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (
                horse
                |
                (
                  (?<=\\s)
                  ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
                  (?=\\s)
                )
              )
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["horse", "zebra"],
              ["battery", "cell"],
            ]),
            s: "var pw = 'correct horse battery staple';",
            expected: "var pw = 'correct horse cell staple';",
          },
        ],
      },
      {
        testName: "corner cases",
        getScenario: () => [
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map(),
            s: "",
            expected: "",
          },
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map(),
            s: "var pw = 'correct horse battery staple';",
            expected: "var pw = 'correct horse battery staple';",
          },
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "",
            expected: "",
          },
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "",
            expected: "",
          },
          {
            patternTemplate: `
              (?<=')
              ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "[^']*", after: "[^']*" })}
              (?=')
            `.replace(/\s/g, ""),
            subPatternTemplate: `
              (?<=\\s)
              ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
              (?=\\s)
            `.replace(/\s/g, ""),
            caseSensitive: true,
            replacements: new Map([
              ["foo", "bar"],
            ]),
            s: "var m = new Map();",
            expected: "var m = new Map();",
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            subPatternTemplate,
            caseSensitive,
            replacements,
            s,
            expected,
          } = testCase;

          const subject = new NestedGroupMangleExpression({
            patternTemplate,
            subPatternTemplate,
            caseSensitive,
          });
          const result = subject.replaceAll(s, replacements);
          expect(result).to.equal(expected);
        }
      });

      test(`${testName}, with groupName`, function() {
        for (const testCase of getScenario()) {
          const {
            patternTemplate,
            subPatternTemplate,
            caseSensitive,
            replacements,
            s,
            expected,
          } = testCase;

          const groupName = "g";

          const subject = new NestedGroupMangleExpression({
            patternTemplate: patternTemplate.replace(
              "NestedGroupMangleExpressionCapturingGroup",
              groupName,
            ),
            subPatternTemplate: subPatternTemplate.replace(
              NestedGroupMangleExpression.SUB_CAPTURE_GROUP,
              `(?<${groupName}>%s)`,
            ),
            groupName,
            caseSensitive,
          });
          const result = subject.replaceAll(s, replacements);
          expect(result).to.equal(expected);
        }
      });
    }
  });
});
