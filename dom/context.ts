import { HSContext, HyperFragment } from "../core/defs.ts";
import { DOMDocument, HElement, HNode } from "./types.ts";

export class DOMContext<
  N extends HNode<N, E>,
  E extends HElement<N, E> & N,
  D extends DOMDocument<N, E>,
> implements HSContext<N, E> {
  document: D;
  Fragment = HyperFragment;

  constructor(doc: D) {
    this.document = doc;
  }

  createElement(name: string): E {
    return this.document.createElement(name);
  }

  createTextNode(text: string): N {
    return this.document.createTextNode(text);
  }

  setAttribute(node: E, name: string, value: string): void {
    node.setAttribute(name, value);
  }

  appendChild(parent: E, child: N): void {
    if (parent.ownerDocument && child.ownerDocument !== parent.ownerDocument) {
      child = parent.ownerDocument.importNode(child, true);
    }
    parent.appendChild(child);
  }

  setInnerHTML(parent: E, html: string): void {
    parent.innerHTML = html;
  }

  // deno-lint-ignore no-explicit-any
  isNode(o: any): o is N {
    // borrowed from hyperscript
    return o && o.nodeType && o.nodeName;
  }
}
