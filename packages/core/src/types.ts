import type { CharSet } from "./characters";

/**
 * Interface representing the options a {@link WebManglerPlugin} has to
 * configure the _WebMangler_ core.
 *
 * @since v0.1.14
 * @version v0.1.18
 */
interface MangleOptions extends MangleEngineOptions {
  /**
   * The {@link MangleExpressionOptions} for every set of {@link
   * MangleExpression}s that should be used when mangling.
   *
   * By providing multiple options for the same set of {@link MangleExpression}s
   * the _WebMangler_ core will use a set with each configuration when mangling.
   *
   * @since v0.1.17
   */
  readonly languageOptions: Iterable<MangleExpressionOptions<unknown>>;
}

/**
 * A set of generic options used by the {@link MangleEngine} for mangling.
 *
 * @since v0.1.0
 * @version v0.1.17
 */
interface MangleEngineOptions {
  /**
   * The pattern(s) to be mangled.
   *
   * @since v0.1.11
   * @version v0.1.17
   */
  readonly patterns: string | Iterable<string>;

  /**
   * The character set for mangled strings.
   *
   * @default {@link ALL_LOWERCASE_CHARS}
   * @since v0.1.7
   */
  readonly charSet?: CharSet;

  /**
   * The prefix to use for mangled strings.
   *
   * @default `""`
   * @since v0.1.0
   * @version v0.1.14
   */
  readonly manglePrefix?: string;

  /**
   * A list of names and patterns not to be used as mangled string.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   * @version v0.1.17
   */
  readonly reservedNames?: Iterable<string>;
}

/**
 * Type representing an object that can be used  by _WebMangler_ to find and
 * replace strings to be mangled that match custom patterns.
 *
 * @since v0.1.0
 * @version v0.1.21
 */
interface MangleExpression {
  /**
   * Find all strings matching `pattern` in the given string `s`.
   *
   * @param s The string to search in.
   * @param pattern The pattern to search with.
   * @returns The matched substrings in `s`.
   * @since v0.1.20
   */
  findAll(s: string, pattern: string): Iterable<string>;

  /**
   * Replace multiple substrings in a string by other substrings.
   *
   * @param s The string to replace in.
   * @param replacements The mapping of strings to replace.
   * @returns The string with the patterns replaced.
   * @since v0.1.11
   */
  replaceAll(s: string, replacements: Map<string, string>): string;
}

/**
 * Type representing a wrapper for the configuration of a set of {@link
 * MangleExpression}s.
 *
 * @example
 * type OptionsType = { value: string };
 * const options = MangleExpressionOptions<OptionsType> = {
 *   name: "expression-group-name",
 *   options: {
 *     value: "foobar",
 *   },
 * };
 * @since v0.1.14
 */
interface MangleExpressionOptions<T> {
  /**
   * The name of the set of {@link MangleExpression}s.
   *
   * @since v0.1.14
   */
  readonly name: string

  /**
   * The configuration for the set of {@link MangleExpression}s.
   *
   * @since v0.1.14
   */
  readonly options: T;
}

/**
 * Type defining the information required by _WebMangler_ about files.
 *
 * NOTE: The _WebMangler_ core **will not** read or write files for you.
 *
 * @since v0.1.0
 */
interface WebManglerFile {
  /**
   * The contents of the file as a string.
   *
   * @since v0.1.0
   */
  content: string;

  /**
   * The type of file, e.g. "js" or "html".
   *
   * This can typically be obtained by looking at the extension of the file.
   *
   * @since v0.1.0
   */
  readonly type: string;
}

/**
 * Type defining the available options for _WebMangler_.
 *
 * @since v0.1.0
 * @version v0.1.17
 */
interface WebManglerOptions {
  /**
   * The plugins to be used by the _WebMangler_.
   *
   * @since v0.1.0
   * @version v0.1.17
   */
  plugins: Iterable<WebManglerPlugin>;

  /**
   * The plugins of language to support.
   *
   * @since v0.1.0
   * @version v0.1.17
   */
  languages: Iterable<WebManglerLanguagePlugin>;
}

/**
 * The interface that every plugin for _WebMangler_ must implement.
 *
 * @since v0.1.0
 * @version v0.1.15
 */
interface WebManglerPlugin {
  /**
   * Get the plugin's options for the _WebMangler_ core.
   *
   * @returns The {@link MangleOptions}.
   * @since v0.1.14
   */
  options(): MangleOptions | Iterable<MangleOptions>;
}

/**
 * The interface that every language plugin for _WebMangler_ must implement.
 *
 * @since v0.1.0
 * @version v0.1.17
 */
interface WebManglerLanguagePlugin {
  /**
   * Get a named set of {@link MangleExpression}s in accordance with an object
   * of options for the set.
   *
   * @param name The name of the set of {@link MangleExpression}s.
   * @param options The options for the set of {@link MangleExpression}s.
   * @returns The {@link MangleExpression}s for every supported language.
   * @since v0.1.16
   */
  getExpressions(
    name: string,
    options: unknown,
  ): Map<string, Iterable<MangleExpression>>;

  /**
   * Get a list of the languages supported by the {@link
   * WebManglerLanguagePlugin}.
   *
   * @returns A list of languages.
   * @since v0.1.9
   */
  getLanguages(): Iterable<string>;
}

export type {
  MangleOptions,
  MangleEngineOptions,
  MangleExpression,
  MangleExpressionOptions,
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
  WebManglerLanguagePlugin,
};
