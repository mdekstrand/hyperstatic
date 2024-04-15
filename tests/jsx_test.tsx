/** @jsxImportSource hyperdeno */
import { assertEquals, assertInstanceOf } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { Document, DocumentFragment, Element, Node } from "@b-fuze/deno-dom";

function Custom(props: { msg: string }) {
  return <span class="msg">{props.msg}</span>;
}

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

  it("instantiates a custom element", () => {
    let root = (
      <div>
        <Custom msg="foo" />
      </div>
    );
    assertEquals(root.outerHTML, '<div><span class="msg">foo</span></div>');
  });

  it("omits null", () => {
    let root = (
      <div>
        {null}
      </div>
    );
    assertEquals(root.outerHTML, "<div></div>");
  });

  it("handles no-value attributes", () => {
    let root = <div data-pagefind-ignore />;
    assertEquals(root.outerHTML, '<div data-pagefind-ignore=""></div>');
  });

  it("can construct a whole page", () => {
    let root = (
      <html>
        <head>
          <title>foobie</title>
        </head>
        <body>
          <h1>bletch</h1>
        </body>
      </html>
    );
    assertEquals(
      root.outerHTML,
      "<html><head><title>foobie</title></head><body><h1>bletch</h1></body></html>",
    );
  });
});
