type AllowedTypes =
  "css" |
  "js" | "cjs" | "mjs" |
  "html" | "xhtml" |
  "unknown";

export default class ManglerFileMock {
  public content: string;
  public type: string;

  constructor(type: AllowedTypes, content: string) {
    this.content = content;
    this.type = type;
  }
}