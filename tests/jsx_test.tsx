/** @jsxImportSource ./jsdom */
import { beforeEach, describe, it } from "mocha";
import assert from "node:assert";

function Custom(props: { msg: string }) {
  return <span class="msg">{props.msg}</span>;
}

describe("modern JSX", () => {
  it("creates an empty element", () => {
    let elt = <div></div>;
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "DIV");
    assert.equal(elt.childNodes.length, 0);
  });

  it("creates nested elements", () => {
    let elt = (
      <div>
        <br />
      </div>
    );
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "DIV");
    assert.equal(elt.childNodes.length, 1);
    assert.equal(elt.outerHTML, "<div><br></div>");
  });

  it("creates more nested elements", () => {
    let elt = (
      <ul>
        <li>one</li>
        <li>two</li>
      </ul>
    );
    assert.equal(elt.nodeType, Node.ELEMENT_NODE);
    assert.equal(elt.nodeName, "UL");
    assert.equal(elt.childNodes.length, 2);
    assert.equal(elt.outerHTML, "<ul><li>one</li><li>two</li></ul>");
  });

  it("creates a document fragment", () => {
    let root = <div></div>;
    let xyz = (
      <>
        xyz <hr />
      </>
    );
    assert(xyz instanceof DocumentFragment);
    root.append(xyz);
    assert.equal(root.outerHTML, "<div>xyz <hr></div>");
  });

  it("instantiates a custom element", () => {
    let root = (
      <div>
        <Custom msg="foo" />
      </div>
    );
    assert.equal(root.outerHTML, "<div><span class=\"msg\">foo</span></div>");
  });

  it("omits null", () => {
    let root = (
      <div>
        {null}
      </div>
    );
    assert.equal(root.outerHTML, "<div></div>");
  });

  it("handles no-value attributes", () => {
    let root = <div data-pagefind-ignore />;
    assert.equal(root.outerHTML, "<div data-pagefind-ignore=\"\"></div>");
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
    assert.equal(
      root.outerHTML,
      "<html><head><title>foobie</title></head><body><h1>bletch</h1></body></html>",
    );
  });
});
