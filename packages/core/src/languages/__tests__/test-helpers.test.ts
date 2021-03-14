import type { TestScenario } from "@webmangler/testing";
import type { MangleExpression } from "../../types";

import { MangleExpressionMock } from "@webmangler/testing";
import { expect } from "chai";
import * as sinon from "sinon";

import { matchesAsExpected } from "./test-helpers";

suite("::matchesAsExpected", function() {
  type TestCase = {
    /**
     * The {@link MangleExpression}s to match with.
     */
    expressions: MangleExpression[];

    /**
     * The input string to match against.
     */
    input: string;

    /**
     * The pattern to use for matching.
     */
    pattern: string;

    /**
     * The expected matches.
     */
    expected: string[];

    /**
     * The expected result of {@link matchesAsExpected}.
     */
    expectedResult: boolean;
  };

  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          expressions: [
            new MangleExpressionMock(
              sinon.stub().returns(["the", "sun"]),
            ),
          ],
          input: "praise the sun",
          pattern: "[a-z]",
          expected: ["the", "sun"],
          expectedResult: true,
        },
        {
          expressions: [
            new MangleExpressionMock(
              sinon.stub().returns(["the", "sun"]),
            ),
          ],
          input: "praise the sun",
          pattern: "[a-z]",
          expected: ["praise"],
          expectedResult: false,
        },
        {
          expressions: [
            new MangleExpressionMock(
              sinon.stub().returns(["the", "sun"]),
            ),
            new MangleExpressionMock(
              sinon.stub().returns(["ise", "the"]),
            ),
          ],
          input: "praise the sun",
          pattern: "[a-z]",
          expected: ["ise", "the"],
          expectedResult: true,
        },
      ],
    },
  ];

  for (const { name, cases } of scenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const {
          expressions,
          input,
          pattern,
          expected,
          expectedResult,
        } = testCase;

        const result = matchesAsExpected(expressions, input, pattern, expected);
        expect(result).to.equal(expectedResult);
      }
    });
  }
});
