import { expect } from "chai";

import { varyQuotes, varySpacing } from "./test-helpers";
import { TestScenario } from "./testing";

import ManglerFileMock from "../../__mocks__/mangler-file.mock";

import mangleEngine from "../../engine";
import BuiltInLanguageSupport from "../../languages/builtin";
import HtmlIdMangler from "../html-ids";

const builtInLanguageSupport = new BuiltInLanguageSupport();

suite("HTML ID Mangler", function() {
  const DEFAULT_PATTERN = "id[-_][a-zA-Z-_]+";

  suite("CSS", function() {
    const scenarios: TestScenario[] = [
      {
        name: "sample",
        cases: [
          {
            input: "#id-foo { }",
            expected: "#a { }",
          },
          {
            input: ".foo { }",
            expected: ".foo { }",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: idNamePattern,
            reserved: reservedIds,
            prefix: keepIdPrefix,
            description: failureMessage,
          } = testCase;

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          htmlIdMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("css", input)];
          const result = htmlIdMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("HTML", function() {
    const scenarios: TestScenario[] = [
      {
        name: "sample",
        cases: [
          ...varySpacing("=", {
            input: "<div id=\"id-foo\"></div>",
            expected: "<div id=\"a\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div id=\"id-foo\"></div>",
            expected: "<div id=\"a\"></div>",
          }),
          ...varySpacing("=", {
            input: "<div href=\"#id-foo\"></div>",
            expected: "<div href=\"#a\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div href=\"#id-foo\"></div>",
            expected: "<div href=\"#a\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div href=\"www.id-foo.com\"></div>",
            expected: "<div href=\"www.id-foo.com\"></div>",
          }),
          {
            input: "<div class=\"id-foo\"></div>",
            expected: "<div class=\"id-foo\"></div>",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: idNamePattern,
            reserved: reservedIds,
            prefix: keepIdPrefix,
            description: failureMessage,
          } = testCase;

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          htmlIdMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("html", input)];
          const result = htmlIdMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("JavaScript", function() {
    const scenarios: TestScenario[] = [
      {
        name: "sample",
        cases: [
          ...varyQuotes("js", {
            input: "document.getElementById(\"id-foo\");",
            expected: "document.getElementById(\"a\");",
          }),
          ...varyQuotes("js", {
            input: "document.querySelector(\"#id-foo\");",
            expected: "document.querySelector(\"#a\");",
          }),
          {
            input: "var id_foo = \".id-bar\");",
            expected: "var id_foo = \".id-bar\");",
            pattern: "id[-_][a-z]+",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: idNamePattern,
            reserved: reservedIds,
            prefix: keepIdPrefix,
            description: failureMessage,
          } = testCase;

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          htmlIdMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("js", input)];
          const result = htmlIdMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  test("no input files", function() {
    const htmlIdMangler = new HtmlIdMangler({
      idNamePattern: DEFAULT_PATTERN,
    });

    const result = htmlIdMangler.mangle(mangleEngine, []);
    expect(result).to.have.lengthOf(0);
  });
});