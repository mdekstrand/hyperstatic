import { assertArrayIncludes, assertEquals, assertFalse } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { Document, Node } from "@b-fuze/deno-dom";

import { hyperstatic } from "../mod.ts";

describe("createElement", () => {
  let h;
  beforeEach(() => {
    h = hyperstatic(new Document());
  });

  it("creates an empty element", () => {
    let elt = h.createElement("div");
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "DIV");
    assertEquals(elt.childNodes.length, 0);
  });

  it("creates an element with attributes", () => {
    let elt = h.createElement("a", { id: "link", href: "https://example.com" });
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "A");
    assertEquals(elt.childNodes.length, 0);
    assertEquals(elt.id, "link");
    assertEquals(elt.getAttribute("href"), "https://example.com");
  });

  it("creates an element with a text child", () => {
    let elt = h.createElement("span", null, "fish");
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "SPAN");
    // the text is right
    assertEquals(elt.textContent, "fish");
    // there aren't any child elements
    assertEquals(elt.childElementCount, 0);
  });

  it("creates an element with multiple text children", () => {
    let elt = h.createElement("span", null, "FOOBIE", " BLETCH");
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "SPAN");
    // the text is right
    assertEquals(elt.textContent, "FOOBIE BLETCH");
    // there aren't any child elements
    assertEquals(elt.childElementCount, 0);
  });

  it("creates an element with an array of text children", () => {
    let elt = h.createElement("span", null, ["FOOBIE", " BLETCH"]);
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "SPAN");
    // the text is right
    assertEquals(elt.textContent, "FOOBIE BLETCH");
    // there aren't any child elements
    assertEquals(elt.childElementCount, 0);
  });

  it("creates a nested element", () => {
    let elt = h.createElement(
      "span",
      null,
      h.createElement("a", { href: "https://example.com/scrolls/identify" }, "README"),
    );
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "SPAN");
    // the text is right
    assertEquals(elt.textContent, "README");
    // it does have a child element
    assertEquals(elt.childElementCount, 1);
    let kid = elt.firstChild;
    assertFalse(kid.nextSibling);
    assertEquals(kid.nodeName, "A");
    assertEquals(kid.getAttribute("href"), "https://example.com/scrolls/identify");
    assertEquals(kid.textContent, "README");
    assertEquals(kid.childElementCount, 0);
  });

  it("creates a deeply nested element", () => {
    let scrolls = [
      ["identify", "HACKEM MUCHE"],
      ["healing", "FOOBIE BLETCH"],
    ];
    let elt = h.createElement(
      "ul",
      null,
      scrolls.map(([type, name]) => [h.createElement(
        "li",
        null,
        h.createElement("a", { href: `https://example.com/scrolls/${type}` }, name),
      )]),
    );
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "UL");
    // we should have some children
    assertEquals(elt.childElementCount, scrolls.length);

    for (let i = 0; i < scrolls.length; i++) {
      let [type, name] = scrolls[i];
      let kid = elt.children[i];
      assertEquals(kid.nodeName, "LI");
      assertEquals(kid.childElementCount, 1);
      let a = kid.children[0];
      assertEquals(a.nodeName, "A");
      assertEquals(a.getAttribute("href"), `https://example.com/scrolls/${type}`);
      assertEquals(a.childElementCount, 0);
      assertEquals(a.textContent, name);
    }
  });

  it("creates an element with hyphenated attributes", () => {
    let elt = h.createElement("span", { dataCitationCount: 42 });
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "SPAN");
    // we have an attribute
    assertArrayIncludes(elt.getAttributeNames(), ["data-citation-count"]);
    // it has the right value
    assertEquals(elt.getAttribute("data-citation-count"), "42");
  });
});
