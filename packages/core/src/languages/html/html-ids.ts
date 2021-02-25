import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_ID = "main";
const GROUP_QUOTE = "quote";

const HTML_QUOTE_CAPTURING_GROUP_PATTERN = `(?<${GROUP_QUOTE}>"|')`;
const HTML_QUOTE_MATCHING_PATTERN = `\\k<${GROUP_QUOTE}>`;
const URL_BASE_PATTERN = "[a-zA-Z0-9\\-\\_\\/\\:\\.]+";
const URL_QUERY_PATTERN = "\\?[a-zA-Z0-9\\_\\-\\=\\%]+";

const expressions: MangleExpression[] = [
  // Id definitions, e.g.:
  //  `<div id="(foo)"></div>`
  //  `<div class="bar" id="(foo)"></div>`
  //  `<div id="(foo)" class="bar"></div>`
  //  `<div disabled id="(foo)" class="bar"></div>`
  //  `<label for="(foo)"></label>`
  //  `<label class="bar" for="(foo)"></label>`
  //  `<label for="(foo)" class="bar"></label>`
  //  `<label disabled for="(foo)" class="bar"></label>`
  new SingleGroupMangleExpression(
    `
      (?<=\\s(id|for)\\s*=\\s*${HTML_QUOTE_CAPTURING_GROUP_PATTERN}\\s*)
      (?<${GROUP_ID}>%s)
      (?=\\s*${HTML_QUOTE_MATCHING_PATTERN})
    `,
    GROUP_ID,
  ),

  // Id usage in hrefs, e.g.:
  //  `<a href="(#foo)"></a>`
  //  `<a href="https://www.example.com/(#foo)"></a>`
  //  `<a href="https://www.example.com/(#foo)?q=bar"></a>`
  new SingleGroupMangleExpression(
    `
      (?<=
        \\shref\\s*=\\s*
        ${HTML_QUOTE_CAPTURING_GROUP_PATTERN}\\s*
        (?:${URL_BASE_PATTERN})?
        #
      )
      (?<${GROUP_ID}>%s)
      (?=
        (?:${URL_QUERY_PATTERN})?
        \\s*
        ${HTML_QUOTE_MATCHING_PATTERN}
      )
    `,
    GROUP_ID,
  ),
];

export default expressions;
