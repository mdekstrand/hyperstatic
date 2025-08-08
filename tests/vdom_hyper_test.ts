import assert from "node:assert";

import { JSDOM } from "jsdom";
import { beforeEach, describe, it } from "mocha";

import { HyperStatic } from "../core/defs.js";
import { makeHyper } from "../core/hyper.js";
import { VDElement, VDNode, VirtualContext } from "../virtual/mod.js";
import { renderDOM } from "../virtual/mod.js";

const dom = new JSDOM();
const Node = dom.window.Node;

describe("h", () => {
  let h: HyperStatic<VDNode, VDElement>;
  let doc: Document;
  beforeEach(() => {
    let ctx = new VirtualContext();
    h = makeHyper(ctx);
    doc = new dom.window.Document();
  });

  it("creates an empty element", () => {
    let elt: any = renderDOM(h("div"), doc);
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "div");
    assert.equal(elt.childNodes.length, 0);
  });

  it("ignores null", () => {
    let elt: any = renderDOM(h("div", {}, null), doc);
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "div");
    assert.equal(elt.childNodes.length, 0);
  });

  it("creates an element with attributes", () => {
    let elt: any = renderDOM(h("a", { id: "link", href: "https://example.com" }), doc);
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "a");
    assert.equal(elt.childNodes.length, 0);
    assert.equal(elt.id, "link");
    assert.equal(elt.getAttribute("href"), "https://example.com");
  });

  it("creates an element with an ID and link", () => {
    let elt: any = renderDOM(h("a#link", { href: "https://example.com" }), doc);
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "a");
    assert.equal(elt.childNodes.length, 0);
    assert.equal(elt.id, "link");
    assert.equal(elt.getAttribute("href"), "https://example.com");
  });

  it("creates an element with a text child", () => {
    let elt: any = renderDOM(h("span", "fish"), doc);
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "span");
    // the text is right
    assert.equal(elt.textContent, "fish");
    // there aren't any child elements
    assert.equal(elt.childElementCount, 0);
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
    assert.equal(elt.nodeName, "nav");
    assert.equal(elt.classList[0], "top");
    assert.equal(elt.children[0].nodeName, "ul");
    assert.equal(elt.children[0].childElementCount, 2);
  });
});
