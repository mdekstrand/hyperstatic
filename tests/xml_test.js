import { assertEquals } from "std/testing/asserts.ts";
import { beforeEach, describe, it } from "std/testing/bdd.ts";
import { DOMImplementation } from "xmldom";

import { hyperstatic } from "../hyperstatic.js";

describe("xml basic dom", () => {
  let impl, document, x;
  beforeEach(() => {
    impl = new DOMImplementation();
    document = impl.createDocument();
    x = hyperstatic({ document });
  });

  it("creates an empty element", () => {
    let elt = x("sitemap");
    assertEquals(elt.nodeName, "sitemap");
    assertEquals(elt.tagName, "sitemap");
  });
});

describe("xml namespaced dom", () => {
  let impl, document, x;
  beforeEach(() => {
    impl = new DOMImplementation();
    document = impl.createDocument("https://xml.ekstrandom.net/example", "root");
    x = hyperstatic({ document });
  });

  it("creates an empty element", () => {
    let elt = x("element");
    assertEquals(elt.nodeName, "element");
    assertEquals(elt.tagName, "element");
  });
});

describe("unnormalized attributes", () => {
  let impl, document, x;
  beforeEach(() => {
    impl = new DOMImplementation();
    document = impl.createDocument();
    x = hyperstatic({ document, normalizeAttrs: false });
  });

  it("creates an empty element", () => {
    let elt = x("svg", { viewBox: "0 0 10 10" });
    assertEquals(elt.nodeName, "svg");
    assertEquals(elt.tagName, "svg");
    assertEquals(elt.getAttribute("viewBox"), "0 0 10 10");
  });
});
