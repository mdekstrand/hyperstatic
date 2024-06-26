import { React } from "./dft-react.ts";
import { assertEquals, assertInstanceOf } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { Document, DocumentFragment, Element, Node } from "@b-fuze/deno-dom";

describe("classic JSX", () => {
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
