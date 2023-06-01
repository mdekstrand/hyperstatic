import { assertEquals } from "std/testing/asserts.ts";
import { beforeEach, describe, it } from "std/testing/bdd.ts";
import { Document, Node } from "deno-dom";

import { hyperstatic } from "../hyperstatic.js";

describe("h", () => {
  let h;
  beforeEach(() => {
    h = hyperstatic({
      document: new Document(),
    });
  });

  it("creates an empty element", () => {
    let elt = h("div");
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
