import type { WebManglerFile } from "../../../types";

import { expect } from "chai";

import WebManglerFileMock from "../../../__mocks__/web-mangler-file.mock";
import { benchmarkFn, readFile } from "../../__tests__/benchmark-helpers";

import manglerEngine from "../../../engine";
import singleValueAttributeExpressionFactory from "../single-value-attributes";

suite("HTML - Single Value Attribute Expression Factory", function() {
  const expressionsMap = new Map();
  const mangleEngineOptions = {
    patterns: "foo[a-zA-Z0-9]+",
  };

  let testFileContent = "";

  suiteSetup(function() {
    const expressions = singleValueAttributeExpressionFactory({
      attributeNames: ["id", "for"],
    });
    expressionsMap.set("html", expressions);

    testFileContent = readFile("sample.html");
  });

  test("simple file", function() {
    const budgetInMillis = 0.1;

    const files: WebManglerFile[] = [
      new WebManglerFileMock("html", testFileContent),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budgetInMillis);
  });

  test("large file", function() {
    const budgetInMillis = 10;

    const files: WebManglerFile[] = [
      new WebManglerFileMock("html", testFileContent.repeat(100)),
    ];

    const result = benchmarkFn(() => {
      manglerEngine(files, expressionsMap, mangleEngineOptions);
    });

    expect(result.medianDuration).to.be.below(budgetInMillis);
  });
});
