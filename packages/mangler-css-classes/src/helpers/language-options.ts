import type {
  MangleExpressionOptions,
  MultiValueAttributeOptions,
  QuerySelectorOptions,
} from "@webmangler/types";

/**
 * A list of the attributes always consider as `class`-like by a {@link
 * CssClassMangler}.
 */
const STANDARD_CLASS_ATTRIBUTES: string[] = [
  "class",
];

/**
 * Get the {@link MangleExpressionOptions} for mangling class-like attributes.
 * The attribute `class` is always included.
 *
 * @param attributes The attributes to treat as `class`-like.
 * @returns The {@link MangleExpressionOptions}.
 */
function getClassAttributeExpressionOptions(
  attributes: Iterable<string> = [],
): MangleExpressionOptions<MultiValueAttributeOptions> {
  return {
    name: "multi-value-attributes",
    options: {
      attributeNames: new Set([
        ...STANDARD_CLASS_ATTRIBUTES,
        ...attributes,
      ]),
    },
  };
}

/**
 * Get the {@link MangleExpressionOptions} for mangling class query selectors.
 *
 * @returns The {@link MangleExpressionOptions}.
 */
function getQuerySelectorExpressionOptions():
    MangleExpressionOptions<QuerySelectorOptions> {
  return {
    name: "query-selectors",
    options: {
      prefix: "\\.",
    },
  };
}

export {
  getClassAttributeExpressionOptions,
  getQuerySelectorExpressionOptions,
};