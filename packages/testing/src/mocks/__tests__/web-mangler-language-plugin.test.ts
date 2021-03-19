import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import WebManglerPluginLanguageMock from "../web-mangler-language-plugin";

chaiUse(sinonChai);

suite("WebManglerPluginLanguageMock", function() {
  suite("::getExpressionsFor", function() {
    test("default stub", function() {
      const pluginMock = new WebManglerPluginLanguageMock();
      expect(pluginMock.getExpressionsFor).not.to.throw();
      expect(pluginMock.getExpressionsFor()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const getExpressionsForStub: SinonStub = sinon.stub();

      const pluginMock = new WebManglerPluginLanguageMock(
        getExpressionsForStub,
      );
      expect(pluginMock.getExpressionsFor).not.to.throw();
      expect(getExpressionsForStub).to.have.callCount(1);
    });
  });

  suite("::getLanguages", function() {
    test("default stub", function() {
      const pluginMock = new WebManglerPluginLanguageMock();
      expect(pluginMock.getLanguages).not.to.throw();
      expect(pluginMock.getLanguages()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const getLanguagesStub: SinonStub = sinon.stub();

      const pluginMock = new WebManglerPluginLanguageMock(
        undefined,
        getLanguagesStub,
      );
      expect(pluginMock.getLanguages).not.to.throw();
      expect(getLanguagesStub).to.have.callCount(1);
    });
  });
});