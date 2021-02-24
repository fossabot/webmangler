import type {
  MangleExpression,
  ManglerExpressions,
  WebManglerLanguagePlugin,
} from "../../types";

/**
 * The {@link MultiLanguagePlugin} class is a utility to create a {@link
 * WebManglerLanguagePlugin} that provides multiple language plugins in one.
 *
 * {@link MultiLanguagePlugin} is used to implement the {@link
 * BuiltInLanguagesPlugin}.
 *
 * @since v0.1.0
 * @version v0.1.13
 */
export default abstract class MultiLanguagePlugin
    implements WebManglerLanguagePlugin {
  /**
   * The {@link WebManglerLanguagePlugin}s in the {@link MultiLanguagePlugin}.
   */
  private readonly plugins: WebManglerLanguagePlugin[];

  /**
   * Initialize a {@link WebManglerLanguagePlugin} with a fixed set of language
   * plugins.
   *
   * @param plugins The plugins to include in the {@link MultiLanguagePlugin}.
   * @since v0.1.0
   */
  constructor(plugins: WebManglerLanguagePlugin[]) {
    this.plugins = plugins;
  }

  /**
   * Will return all the expressions for the mangler from every plugin in the
   * {@link MultiLanguagePlugin}.
   *
   * @inheritDoc
   * @deprecated
   */
  getExpressionsFor(manglerId: string): ManglerExpressions[] {
    const result: ManglerExpressions[] = [];
    this.plugins.forEach((plugin) => {
      result.push(...plugin.getExpressionsFor(manglerId));
    });

    return result;
  }

  /**
   * @inheritDoc
   */
  getExpressions(manglerId: string): Map<string, MangleExpression[]> {
    const result: Map<string, MangleExpression[]> = new Map();
    this.plugins.forEach((plugin) => {
      const pluginExpressions = plugin.getExpressions(manglerId);
      pluginExpressions.forEach((value, key) => result.set(key, value));
    });

    return result;
  }


  /**
   * Will return all the languages supported by every plugin in the {@link
   * MultiLanguagePlugin}.
   *
   * @inheritDoc
   */
  getLanguages(): string[] {
    const result: string[] = [];
    this.plugins.forEach((plugin) => {
      result.push(...plugin.getLanguages());
    });

    return result;
  }
}
