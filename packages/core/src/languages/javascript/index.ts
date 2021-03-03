import type { MangleExpression } from "../../types";
import type { ExpressionFactory } from "../utils/simple-language-plugin.class";

import SimpleLanguagePlugin from "../utils/simple-language-plugin.class";

import attributeExpressionFactory from "./attributes";
import cssClassesMatchers from "./css-classes";
import cssDeclarationPropertyExpressionFactory from "./css-properties";
import cssVariablesMatchers from "./css-variables";
import htmlAttributeMatchers from "./html-attributes";
import htmlIdMatchers from "./html-ids";
import querySelectorExpressionFactory from "./query-selectors";

const languages: string[] = ["js", "cjs", "mjs"];
const expressions: Map<string, MangleExpression[]> = new Map();

expressions.set("css-class-mangler", cssClassesMatchers);
expressions.set("css-variable-mangler", cssVariablesMatchers);
expressions.set("html-attribute-mangler", htmlAttributeMatchers);
expressions.set("html-id-mangler", htmlIdMatchers);

const map: Map<string, ExpressionFactory> = new Map();
map.set("attributes", attributeExpressionFactory);
map.set("css-declaration-properties", cssDeclarationPropertyExpressionFactory);
map.set("query-selectors", querySelectorExpressionFactory);

/**
 * This {@link WebManglerLanguagePlugin} provides JavaScript support for the
 * built-in {@link WebManglerPlugin}s.
 *
 * @example
 * webmangler({
 *   plugins: [], // any built-in plugin(s)
 *   languages: [new JavaScriptLanguageSupport()],
 * });
 *
 * @since v0.1.0
 * @version v0.1.14
 */
export default class JavaScriptLanguageSupport extends SimpleLanguagePlugin {
  /**
   * Instantiate a new {@link JavaScriptLanguageSupport} plugin.
   */
  constructor() {
    super(languages, expressions, map);
  }
}
