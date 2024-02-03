import { assertEquals } from "std/assert/mod.ts";
import { beforeEach, describe, it } from "std/testing/bdd.ts";
import { Document, Element, Node } from "deno-dom";

import { DOMContext } from "../core/dom.ts";
import { HyperStatic } from "../core/defs.ts";
import { hyperstatic } from "../core/hyper.ts";

describe("h", () => {
  let h: HyperStatic<Node, Element>;
  beforeEach(() => {
    let ctx = new DOMContext<Node, Document>(new Document());
    h = hyperstatic(ctx);
  });

  it("creates an empty element", () => {
    let elt = h("div");
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "DIV");
    assertEquals(elt.childNodes.length, 0);
  });

  it("ignores null", () => {
    let elt = h("div", {}, null);
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "DIV");
    assertEquals(elt.childNodes.length, 0);
  });

  it("creates an element with attributes", () => {
    let elt = h("a", { id: "link", href: "https://example.com" });
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "A");
    assertEquals(elt.childNodes.length, 0);
    assertEquals(elt.id, "link");
    assertEquals(elt.getAttribute("href"), "https://example.com");
  });

  it("creates an element with an ID and link", () => {
    let elt = h("a#link", { href: "https://example.com" });
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "A");
    assertEquals(elt.childNodes.length, 0);
    assertEquals(elt.id, "link");
    assertEquals(elt.getAttribute("href"), "https://example.com");
  });

  it("creates an element with a text child", () => {
    let elt = h("span", "fish");
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "SPAN");
    // the text is right
    assertEquals(elt.textContent, "fish");
    // there aren't any child elements
    assertEquals(elt.childElementCount, 0);
  });

  it("creates nested with classes", () => {
    let elt = h("nav.top", [
      h("ul", [
        h("li", h("a", { href: "/" }, "Home")),
        h("li", h("a", { href: "/search" }, "Search")),
      ]),
    ]);
    assertEquals(elt.nodeName, "NAV");
    assertEquals(elt.classList[0], "top");
    assertEquals(elt.children[0].nodeName, "UL");
    assertEquals(elt.children[0].childElementCount, 2);
  });
});
