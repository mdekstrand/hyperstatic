import { assert, assertEquals } from "std/assert/mod.ts";
import { beforeEach, describe, it } from "std/testing/bdd.ts";
import { Document, Element, Node } from "deno-dom";

import { HyperStatic } from "../core/defs.ts";
import { hyperstatic } from "../core/hyper.ts";
import { VDElement, VDNode, VirtualContext } from "../virtual/mod.ts";
import { renderDOM } from "../virtual/mod.ts";

describe("h", () => {
  let h: HyperStatic<VDNode, VDElement>;
  let doc: Document;
  beforeEach(() => {
    let ctx = new VirtualContext();
    h = hyperstatic(ctx);
    doc = new Document();
  });

  it("creates an empty element", () => {
    let elt: any = renderDOM(h("div"), doc);
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "DIV");
    assertEquals(elt.childNodes.length, 0);
  });

  it("ignores null", () => {
    let elt: any = renderDOM(h("div", {}, null), doc);
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "DIV");
    assertEquals(elt.childNodes.length, 0);
  });

  it("creates an element with attributes", () => {
    let elt: any = renderDOM(h("a", { id: "link", href: "https://example.com" }), doc);
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "A");
    assertEquals(elt.childNodes.length, 0);
    assertEquals(elt.id, "link");
    assertEquals(elt.getAttribute("href"), "https://example.com");
  });

  it("creates an element with an ID and link", () => {
    let elt: any = renderDOM(h("a#link", { href: "https://example.com" }), doc);
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "A");
    assertEquals(elt.childNodes.length, 0);
    assertEquals(elt.id, "link");
    assertEquals(elt.getAttribute("href"), "https://example.com");
  });

  it("creates an element with a text child", () => {
    let elt: any = renderDOM(h("span", "fish"), doc);
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "SPAN");
    // the text is right
    assertEquals(elt.textContent, "fish");
    // there aren't any child elements
    assertEquals(elt.childElementCount, 0);
  });

  it("creates nested with classes", () => {
    let elt: any = renderDOM(
      h("nav.top", [
        h("ul", [
          h("li", h("a", { href: "/" }, "Home")),
          h("li", h("a", { href: "/search" }, "Search")),
        ]),
      ]),
      doc,
    );
    assertEquals(elt.nodeName, "NAV");
    assertEquals(elt.classList[0], "top");
    assertEquals(elt.children[0].nodeName, "UL");
    assertEquals(elt.children[0].childElementCount, 2);
  });
});
