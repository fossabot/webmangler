import { expect } from "chai";

import CssClassMangler from "../../manglers/css-classes";
import CssVariableMangler from "../../manglers/css-variables";
import HtmlAttributeMangler from "../../manglers/html-attributes";
import HtmlIdMangler from "../../manglers/html-ids";

import HtmlLanguageSupport from "../html";

suite("Built-in HTML Language Support", function() {
  test(`has support for the ${CssClassMangler._ID} mangler`, function() {
    const plugin = new HtmlLanguageSupport();

    const expressions = plugin.getExpressionsFor(CssClassMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${CssVariableMangler._ID} mangler`, function() {
    const plugin = new HtmlLanguageSupport();

    const expressions = plugin.getExpressionsFor(CssVariableMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${HtmlAttributeMangler._ID} mangler`, function() {
    const plugin = new HtmlLanguageSupport();

    const expressions = plugin.getExpressionsFor(HtmlAttributeMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${HtmlIdMangler._ID} mangler`, function() {
    const plugin = new HtmlLanguageSupport();

    const expressions = plugin.getExpressionsFor(HtmlIdMangler._ID);
    expect(expressions).to.have.length.above(0);
  });
});