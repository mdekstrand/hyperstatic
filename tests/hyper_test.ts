import { JSDOM } from "jsdom";
import { beforeEach, describe, it } from "mocha";
import assert from "node:assert/strict";

import { HSContext, HyperStatic } from "../core/defs.js";
import { DOMContext, isDOMElement } from "../core/dom.js";
import { makeHyper } from "../core/hyper.js";
import { makeHyperJS } from "../jdsom/mod.js";

describe("h", () => {
  let js: JSDOM;
  let Node, Element;
  let h: HyperStatic<Node, Element>;
  beforeEach(() => {
    js = new JSDOM("");
    Node = js.window.Node;
    Element = js.window.Element;
    h = makeHyper<Node, Element>(new DOMContext(js.window.document));
  });

  it("creates an empty element", () => {
    let elt = h("div");
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "DIV");
    assert.equal(elt.childNodes.length, 0);
  });

  it("ignores null", () => {
    let elt = h("div", {}, null);
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "DIV");
    assert.equal(elt.childNodes.length, 0);
  });

  it("creates an element with attributes", () => {
    let elt = h("a", { id: "link", href: "https://example.com" });
    assert(isDOMElement(elt));
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "A");
    assert.equal(elt.childNodes.length, 0);
    assert.equal(elt.id, "link");
    assert.equal(elt.getAttribute("href"), "https://example.com");
  });

  it("creates an element with an ID and link", () => {
    let elt = h("a#link", { href: "https://example.com" });
    assert(isDOMElement(elt));
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "A");
    assert.equal(elt.childNodes.length, 0);
    assert.equal(elt.id, "link");
    assert.equal(elt.getAttribute("href"), "https://example.com");
  });

  it("creates an element with a text child", () => {
    let elt = h("span", "fish") as Element;
    assert(isDOMElement(elt));
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "SPAN");
    // the text is right
    assert.equal(elt.textContent, "fish");
    // there aren't any child elements
    assert.equal(elt.childElementCount, 0);
  });

  it("creates nested with classes", () => {
    let elt = h("nav.top", [
      h("ul", [
        h("li", h("a", { href: "/" }, "Home")),
        h("li", h("a", { href: "/search" }, "Search")),
      ]),
    ]) as Element;
    assert(isDOMElement(elt));
    assert.equal(elt.nodeName, "NAV");
    assert.equal(elt.classList[0], "top");
    assert.equal(elt.children[0].nodeName, "UL");
    assert.equal(elt.children[0].childElementCount, 2);
  });
});
