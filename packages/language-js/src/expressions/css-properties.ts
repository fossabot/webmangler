import type {
  CssDeclarationPropertyOptions,
  MangleExpression,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

const GROUP_QUOTE = "q";

/**
 * Get a {@link MangleExpression} to match property names as standalone strings
 * in JavaScript, e.g. `foobar` in `$element.style.getPropertyValue("foobar");`.
 *
 * @param propertyPrefix The prefix required on property names.
 * @param propertySuffix The suffix required on property names.
 * @returns The {@link MangleExpression}s to match standalone properties in JS.
 */
function newPropertyAsStandaloneStringExpressions(
  propertyPrefix: string,
  propertySuffix: string,
): Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.comment})
          |
          (?<=
            (?<${GROUP_QUOTE}>${patterns.quotes})
            \\s*
            ${propertyPrefix}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${propertySuffix}
            \\s*
            \\k<${GROUP_QUOTE}>
          )
        )
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match the properties of CSS
 * declarations in JavaScript. This will match:
 * - Standalone strings (e.g. `foobar` in `getPropertyValue("foobar");`).
 *
 * @param options The {@link CssDeclarationPropertyOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.28
 */
function cssDeclarationPropertyExpressionFactory(
  options: CssDeclarationPropertyOptions,
): Iterable<MangleExpression> {
  const propertyPrefix = options.prefix ? options.prefix : "";
  const propertySuffix = options.suffix ? options.suffix : "";

  return [
    ...newPropertyAsStandaloneStringExpressions(propertyPrefix, propertySuffix),
  ];
}

export default cssDeclarationPropertyExpressionFactory;
