/// <reference lib="dom" />
import assert from "node:assert";

import { beforeEach, describe, it } from "mocha";

import { Document, DOMImplementation, Element, Node } from "@xmldom/xmldom";

import { HyperStatic, hyperstatic } from "../mod.js";

describe("xml basic dom", () => {
  let impl: DOMImplementation, document: Document, x: HyperStatic<Node, Element>;
  beforeEach(() => {
    impl = new DOMImplementation();
    document = impl.createDocument(null, "xml");
    x = hyperstatic(document);
  });

  it("creates an empty element", () => {
    let elt = x("sitemap");
    assert.equal(elt.nodeName, "sitemap");
    assert.equal(elt.tagName, "sitemap");
  });
});

describe("xml namespaced dom", () => {
  let impl: DOMImplementation, document: Document, x: HyperStatic<Node, Element>;
  beforeEach(() => {
    impl = new DOMImplementation();
    document = impl.createDocument("https://xml.ekstrandom.net/example", "root");
    x = hyperstatic(document);
  });

  it("creates an empty element", () => {
    let elt = x("element");
    assert.equal(elt.nodeName, "element");
    assert.equal(elt.tagName, "element");
  });
});

describe("unnormalized attributes", () => {
  let impl: DOMImplementation, document: Document, x: HyperStatic<Node, Element>;
  beforeEach(() => {
    impl = new DOMImplementation();
    document = impl.createDocument(null, "xml");
    x = hyperstatic(document, { normalizeAttrs: false });
  });

  it("creates an empty element", () => {
    let elt = x("svg", { viewBox: "0 0 10 10" });
    assert.equal(elt.nodeName, "svg");
    assert.equal(elt.tagName, "svg");
    assert.equal(elt.getAttribute("viewBox"), "0 0 10 10");
  });
});
