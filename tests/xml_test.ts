/// <reference lib="dom" />
import { assertEquals } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { Document, DOMImplementation, Element, Node } from "@xmldom/xmldom";

import { HyperStatic, hyperstatic } from "../mod.ts";

describe("xml basic dom", () => {
  let impl: DOMImplementation, document: Document, x: HyperStatic<Node, Element>;
  beforeEach(() => {
    impl = new DOMImplementation();
    document = impl.createDocument(null, "xml");
    x = hyperstatic(document);
  });

  it("creates an empty element", () => {
    let elt = x("sitemap");
    assertEquals(elt.nodeName, "sitemap");
    assertEquals(elt.tagName, "sitemap");
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
    assertEquals(elt.nodeName, "element");
    assertEquals(elt.tagName, "element");
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
    assertEquals(elt.nodeName, "svg");
    assertEquals(elt.tagName, "svg");
    assertEquals(elt.getAttribute("viewBox"), "0 0 10 10");
  });
});
