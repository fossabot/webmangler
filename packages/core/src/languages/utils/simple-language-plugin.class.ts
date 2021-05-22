import type { MangleExpression, WebManglerLanguagePlugin } from "../../types";

/**
 * A function that produces a set of {@link MangleExpression}s given the set's
 * options.
 *
 * @since v0.1.14
 * @version v0.1.17
 */
export type ExpressionFactory = (options: any) => Iterable<MangleExpression>; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * The {@link SimpleLanguagePlugin} abstract class provides an implementation of
 * a {@link WebManglerLanguagePlugin} that works given a set of languages and a
 * map of manglers to {@link MangleExpression}.
 *
 * It is recommended to extend this class - or {@link MultiLanguagePlugin},
 * depending on your needs - if you're implementing a {@link
 * WebManglerLanguagePlugin}.
 *
 * @since v0.1.0
 * @version v0.1.17
 */
export default abstract class SimpleLanguagePlugin
    implements WebManglerLanguagePlugin {
  /**
   * The languages, including aliases, that this {@link SimpleLanguagePlugin}
   * supports.
   */
  private readonly languages: Iterable<string>;

  /**
   * A map from {@link MangleExpression}-set names to a functions that produce
   * the respective set of {@link MangleExpression}s given the set's options.
   */
  private readonly expressionFactories: Map<string, ExpressionFactory>;

  /**
   * Initialize a new {@link SimpleLanguagePlugin}.
   *
   * @example
   * class LanguagePlugin extends SimpleLanguagePlugin {
   *   constructor() {
   *     super(["js", "cjs", "mjs"], expressions);
   *   }
   * }
   * @param languages Supported language, including aliases.
   * @param expressionFactories The {@link ExpressionFactory}s to use.
   * @since v0.1.15
   * @version v0.1.17
   */
  constructor(
    languages: Iterable<string>,
    expressionFactories: Map<string, ExpressionFactory>,
  ) {
    this.languages = languages;
    this.expressionFactories = expressionFactories;
  }

  /**
   * @inheritDoc
   * @version v0.1.17
   */
  getExpressions(
    name: string,
    options: unknown,
  ): Map<string, Iterable<MangleExpression>> {
    const map: Map<string, Iterable<MangleExpression>> = new Map();

    const expressionFactory = this.expressionFactories.get(name);
    if (expressionFactory === undefined) {
      return map;
    }

    const expressions = expressionFactory(options);
    for (const language of this.languages) {
      map.set(language, expressions);
    }

    return map;
  }

  /**
   * Will return all the languages configured when the {@link
   * SimpleLanguagePlugin} was initialized.
   *
   * @inheritDoc
   * @version v0.1.17
   */
  getLanguages(): Iterable<string> {
    return this.languages;
  }
}
