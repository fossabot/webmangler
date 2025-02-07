import type { WebManglerLanguagePlugin } from "@webmangler/types";
import type { ExpressionFactory } from "@webmangler/language-utils";

import { SimpleLanguagePlugin } from "@webmangler/language-utils";

/**
 * The constructor type of the {@link CssLanguagePlugin} class.
 */
type CssLanguagePluginConstructor = new (
  options?: CssLanguagePluginOptions
) => WebManglerLanguagePlugin;

/**
 * The interface defining the dependencies of the {@link CssLanguagePlugin}
 * class.
 */
interface CssLanguagePluginDependencies {
  /**
   * Get all the expression factories for a new {@link CssLanguagePlugin}
   * instance.
   *
   * @returns The expression factories {@link Map}.
   */
  getExpressionFactories(): Map<string, ExpressionFactory>;

  /**
   *
   * @param [configuredLanguages] The configured languages, if any.
   * @returns The languages for the instances.
   */
  getLanguages(
    configuredLanguages?: Iterable<string>,
  ): Iterable<string>;
}

/**
 * The options for _WebMangler_'s built-in {@link CssLanguagePlugin}.
 *
 * @since v0.1.17
 */
interface CssLanguagePluginOptions {
  /**
   * One or more extensions that the {@link CssLanguagePlugin} should be used
   * for. This can be used when CSS files have a non-standard extension or to
   * use this plugin for CSS-like languages.
   *
   * NOTE: the default extensions are always included and do not need to be
   * specified when using this option.
   *
   * @default `["css"]`
   * @since v0.1.17
   */
  cssExtensions?: Iterable<string>;
}

/**
 * Initialize the {@link CssLanguagePlugin} class with explicit dependencies.
 *
 * @param helpers The dependencies of the class.
 * @param helpers.getExpressionFactories A function to get expression factories.
 * @param helpers.getLanguages A function to get supported language extensions.
 * @returns The {@link CssLanguagePlugin} class.
 */
function initCssLanguagePlugin({
  getExpressionFactories,
  getLanguages,
}: CssLanguagePluginDependencies): CssLanguagePluginConstructor {
  return class CssLanguagePlugin extends SimpleLanguagePlugin {
    /**
     * Instantiate a new {@link CssLanguagePlugin} plugin.
     *
     * @param [options] The {@link CssLanguagePluginOptions}.
     * @since v0.1.0
     * @version v0.1.17
     */
    constructor(options: CssLanguagePluginOptions={}) {
      super(
        getLanguages(options.cssExtensions),
        getExpressionFactories(),
      );
    }
  };
}

export default initCssLanguagePlugin;

export type {
  CssLanguagePluginOptions,
};
