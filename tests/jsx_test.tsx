/** @jsxImportSource hyperdeno */
import { assertEquals, assertInstanceOf } from "std/testing/asserts.ts";
import { beforeEach, describe, it } from "std/testing/bdd.ts";
import { Document, DocumentFragment, Element, Node } from "deno-dom";

import { HyperStatic, hyperstatic } from "../hyperstatic.ts";

describe("modern JSX", () => {
  it("creates an empty element", () => {
    let elt = <div></div>;
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "DIV");
    assertEquals(elt.childNodes.length, 0);
  });

  it("creates nested elements", () => {
    let elt = (
      <div>
        <br />
      </div>
    );
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "DIV");
    assertEquals(elt.childNodes.length, 1);
    assertEquals(elt.outerHTML, "<div><br></div>");
  });

  it("creates more nested elements", () => {
    let elt = (
      <ul>
        <li>one</li>
        <li>two</li>
      </ul>
    );
    assertEquals(elt.nodeType, Node.ELEMENT_NODE);
    assertEquals(elt.nodeName, "UL");
    assertEquals(elt.childNodes.length, 2);
    assertEquals(elt.outerHTML, "<ul><li>one</li><li>two</li></ul>");
  });

  it("creates a document fragment", () => {
    let root = <div></div>;
    let xyz = (
      <>
        xyz <hr />
      </>
    );
    assertInstanceOf(xyz, DocumentFragment);
    root.append(xyz);
    assertEquals(root.outerHTML, "<div>xyz <hr></div>");
  });
});
