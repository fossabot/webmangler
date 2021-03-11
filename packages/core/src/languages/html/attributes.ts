import type { MangleExpression } from "../../types";

import { NestedGroupExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match attributes in HTML, e.g. `data-foo` in
 * `<div data-foo="bar"></div>`.
 *
 * @returns The {@link MangleExpression}s to match element attributes in HTML.
 */
function newElementAttributeExpressions(): MangleExpression[] {
  return ["\"", "'"].map((quote) => new NestedGroupExpression(
    `
      (?<=\\<\\s*[a-zA-Z0-9]+\\s+)
      (?<${GROUP_MAIN}>
        (?:
          [^>${quote}]+
          ${quote}[^${quote}]*${quote}
          \\s
        )*
        %s
        (?:
          (?:\\=|\\s)
          [^>]*
        )?
      )
      (?=\\>)
    `,
    `
      (?<=\\s|^)
      (?<${GROUP_MAIN}>%s)
      (?=\\=|\\s|$)
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get the set of {@link MangleExpression}s to match attributes in HTML. This
 * will match:
 * - Element attributes (e.g. `data-foo` in `<div data-foo="bar"></div>`).
 *
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 */
export default function attributeExpressionFactory(): MangleExpression[] {
  return [
    ...newElementAttributeExpressions(),
  ];
}