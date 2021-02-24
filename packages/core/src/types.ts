import type { CharSet } from "./characters";

/**
 * A set of generic options used by the {@link MangleEngine} for mangling.
 *
 * @since v0.1.0
 * @version v0.1.13
 */
type MangleEngineOptions = {
  /**
   * The {@link WebManglerPlugin} identifier.
   *
   * @since v0.1.13
   */
  readonly id: string;

  /**
   *The {@link MangleExpression}s to find strings to mangle.
   *
   * @since v0.1.11
   * @deprecated
   */
  readonly expressions?: Map<string, MangleExpression[]>;

  /**
   * The pattern(s) to be mangled.
   *
   * @since v0.1.11
   */
  readonly patterns: string | string[];

  /**
   * The character set for mangled strings.
   *
   * @default {@link NameGenerator.DEFAULT_CHARSET}
   * @since v0.1.7
   */
  readonly charSet?: CharSet;

  /**
   * The prefix to use for mangled strings.
   *
   * @default `""`
   * @since v0.1.0
   * @deprecated Will be changed to `readonly`.
   */
  manglePrefix?: string;

  /**
   * A list of names and patterns not to be used as mangled string.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   * @deprecated Will be changed to `readonly`.
   */
  reservedNames?: string[];
}

/**
 * Interface representing a regular expression-like object that can be used to
 * find and replace patterns by _WebMangler_.
 *
 * @since v0.1.0
 * @version v0.1.13
 */
interface MangleExpression {
  /**
   * Execute the {@link MangleExpression} on a string for a given pattern.
   *
   * @param s The string to execute the expression on.
   * @param pattern The pattern to execute the expression with.
   * @returns The matched substrings in `s`.
   * @since v0.1.0
   */
  exec(s: string, pattern: string): Iterable<string>;

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
 * Interface representing a regular expression-like object that can be used to
 * find and replace patterns by _WebMangler_.
 *
 * @since v0.1.0
 * @version v0.1.11
 * @deprecated
 */
interface ManglerExpression {
  /**
   * Execute the {@link MangleExpression} on a string for a given pattern.
   *
   * @param s The string to execute the expression on.
   * @param pattern The pattern to execute the expression with.
   * @returns The matched substrings in `s`.
   * @since v0.1.0
   */
  exec(s: string, pattern: string): Iterable<string>;

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
 * Interface wrapping one ore more {@link MangleExpression}s for a specific
 * language.
 *
 * @since v0.1.0
 * @deprecated
 */
interface ManglerExpressions {
  /**
   * The language for which the `expressions` are.
   *
   * @since v0.1.0
   */
  language: string;

  /**
   * The {@link MangleExpression}s for the `language`.
   *
   * @since v0.1.0
   */
  expressions: MangleExpression[];
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
 */
interface WebManglerOptions {
  /**
   * The plugins to be used by the _WebMangler_.
   *
   * @since v0.1.0
   */
  plugins: WebManglerPlugin[];

  /**
   * The plugins of language to support.
   *
   * @since v0.1.0
   */
  languages: WebManglerLanguagePlugin[];
}

/**
 * The interface that every plugin for _WebMangler_ must implement.
 *
 * @since v0.1.0
 * @version v0.1.11
 */
interface WebManglerPlugin {
  /**
   * Get the plugin's configuration for {@link MangleEngine}.
   *
   * @returns The {@link MangleEngineOptions}.
   * @since v0.1.11
   */
  config(): MangleEngineOptions | MangleEngineOptions[];

  /**
   * Instruct the {@link WebManglerPlugin} to use the {@link MangleExpression}s
   * specified by a {@link WebManglerLanguagePlugin}.
   *
   * @param languagePlugin The {@link WebManglerLanguagePlugin} to be used.
   * @since v0.1.0
   * @deprecated
   */
  use(languagePlugin: WebManglerLanguagePlugin): void;
}

/**
 * The interface that every language plugin for _WebMangler_ must implement.
 *
 * @since v0.1.0
 * @version v0.1.13
 */
interface WebManglerLanguagePlugin {
  /**
   * Get {@link MangleExpression}s for one or more languages for a {@link
   * WebManglerPlugin}.
   *
   * If the {@link WebManglerLanguagePlugin} supports multiple languages it may
   * return a {@link ManglerExpressions} instance for each language.
   *
   * If the {@link WebManglerLanguagePlugin} does not provide support for the
   * {@link WebManglerPlugin} it should return zero {@link MangleExpression}s.
   *
   * @param pluginId The identifier of the {@link WebManglerPlugin}.
   * @returns The {@link MangleExpression}s for the plugin for the language(s).
   * @since v0.1.0
   * @deprecated
   */
  getExpressionsFor(pluginId: string): ManglerExpressions[];

  /**
   * Get {@link MangleExpression}s for a {@link WebManglerPlugin}.
   *
   * In the returned map, the key is a language identifier and the value are the
   * {@link MangleExpression}s.
   *
   * @since v0.1.13
   */
  getExpressions(pluginId: string): Map<string, MangleExpression[]>;

  /**
   * Get a list of the languages supported by the {@link
   * WebManglerLanguagePlugin}.
   *
   * @returns A list of languages.
   * @since v0.1.9
   */
  getLanguages(): string[];
}

export type {
  MangleEngineOptions,
  MangleExpression,
  ManglerExpression,
  ManglerExpressions,
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
  WebManglerLanguagePlugin,
};
