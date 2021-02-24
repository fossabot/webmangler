import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_ID = "main";
const GROUP_QUOTE = "quote";

const CSS_SELECTOR_REQUIRED_AFTER = "\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s|$";

const CSS_QUOTE_CAPTURING_GROUP_PATTERN = `(?<${GROUP_QUOTE}>"|')`;
const CSS_QUOTE_MATCHING_PATTERN = `\\k<${GROUP_QUOTE}>`;
const ATTR_SELECTOR_METHODS_PATTERN = "\\=|\\|=|\\~=|\\^=|\\$=|\\*=";
const URL_BASE_PATTERN = "[a-zA-Z0-9\\-\\_\\/\\:\\.]+";

const expressions: MangleExpression[] = [
  // ID selectors, e.g.:
  //  `(#foo){ }`
  //  `(#foo) { }`
  //  `(#foo), .bar { }`
  //  `(#foo).bar { }`
  //  `(#foo)#no-match { }`
  //  `(#foo)[data-value] { }`
  //  `(#foo):focus { }`
  //  `(#foo)::before { }`
  //  `div(#foo) { }`
  //  `div:not\((#foo)\) { }`
  //  `(#foo)>div { }`
  //  `(#foo)+div { }`
  //  `(#foo)~div { }`
  //  `div>(#foo) { }`
  //  `div+(#foo) { }`
  //  `div~(#foo) { }`
  //  `div { } (#foo) { }`
  //  `div { } (#foo) { }`
  //  `(#foo)`
  new SingleGroupMangleExpression(
    `
      (?<!"[^"}]*|'[^'}]*)
      (?<=#)
      (?<${GROUP_ID}>%s)
      (?=${CSS_SELECTOR_REQUIRED_AFTER})
    `,
    GROUP_ID,
  ),

  // Href attribute selector, e.g.:
  //  `[href="(#foo)"]`
  //  `[href="https://www.example.com/foo(#bar)"]`
  //  `[href|="(#foo)"]`
  //  `[href~="(#foo)"]`
  //  `[href^="(#foo)"]`
  //  `[href$="(#foo)"]`
  //  `[href*="(#foo)"]`
  new SingleGroupMangleExpression(
    `
      (?<=
        \\[\\s*href\\s*(?:${ATTR_SELECTOR_METHODS_PATTERN})\\s*
        ${CSS_QUOTE_CAPTURING_GROUP_PATTERN}\\s*
        (?:${URL_BASE_PATTERN})?
        #
      )
      (?<${GROUP_ID}>%s)
      (?=\\s*${CSS_QUOTE_MATCHING_PATTERN}\\s*\\])
    `,
    GROUP_ID,
  ),
];

export default expressions;
