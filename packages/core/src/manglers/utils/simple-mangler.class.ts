import type { CharSet } from "../../characters";
import type { MangleEngineOptions, WebManglerPlugin } from "../../types";

/**
 * Interface defining the configuration of a {@link SimpleLanguagePlugin}.
 *
 * @since v0.1.0
 * @version v0.1.7
 */
interface SimpleManglerOptions {
  /**
   * The character set to use when mangling.
   *
   * @since v0.1.7
   */
  charSet: CharSet;

  /**
   * One or more patterns that should be mangled.
   *
   * @since v0.1.0
   */
  patterns: string | string[];

  /**
   * A list of names that should not be outputted by the mangler.
   *
   * @since v0.1.0
   */
  reserved: string[];

  /**
   * The prefix to use whe mangling.
   *
   * @since v0.1.0
   */
  prefix: string;
}

/**
 * The {@link SimpleManglerPlugin} abstract class provides an implementation of
 * a {@link WebManglerPlugin} that deals with the handling of {@link
 * WebManglerLanguagePlugin} and implements {@link WebManglerPlugin.mangle} for
 * a given character set, set of patterns, reserved values, and prefix.
 *
 * It is recommended to extend this class - or {@link BaseManglerPlugin} or
 * {@link MultiMangler}, depending on your needs - if you're implementing a
 * {@link WebManglerPlugin}.
 *
 * @since v0.1.0
 * @version v0.1.13
 */
export default abstract class SimpleManglerPlugin implements WebManglerPlugin {
  /**
   * The identifier of the {@link WebManglerPlugin}.
   */
  private readonly id: string;

  /**
   * The character set to use when mangling.
   */
  private readonly charSet: CharSet;

  /**
   * The pattern(s) to be mangled.
   */
  private readonly patterns: string | string[];

  /**
   * The reserved names not to be used by this mangler.
   */
  private readonly reserved: string[];

  /**
   * The prefix to be used by this mangler.
   */
  private readonly prefix: string;

  /**
   * Initialize a new {@link WebManglerPlugin}.
   *
   * @param id The identifier for the {@link WebManglerPlugin}.
   * @param options The character set, patterns, reserved values, and prefix.
   */
  constructor(id: string, options: SimpleManglerOptions) {
    this.id = id;
    this.charSet = options.charSet;
    this.patterns = options.patterns;
    this.reserved = options.reserved;
    this.prefix = options.prefix;
  }

  /**
   * @inheritDoc
   * @since v0.1.11
   */
  config(): MangleEngineOptions {
    return {
      id: this.id,
      patterns: this.patterns,
      charSet: this.charSet,
      reservedNames: this.reserved,
      manglePrefix: this.prefix,
    };
  }

  /**
   * @inheritDoc
   * @since v0.1.13
   * @deprecated
   */
  use(): void {
    throw new Error("Deprecated method not implemented.");
  }
}
