import { HSContext } from "./defs.ts";

const HyperFragment = Symbol("HyperFragment");

export interface DOMDocument<N, E extends N> {
  createElement(name: string): E;
  createTextNode(text: string): N;
  importNode(node: N, deep?: boolean): N;
}

export interface HNode<N, E extends N> {
  nodeType: unknown;
  nodeName: string;
  appendChild(node: N): HNode<N, E>;
  ownerDocument: DOMDocument<N, E> | null;
}

export interface HElement<N, E extends N> extends HNode<N, E> {
  setAttribute(name: string, value: string): void;
  append(...children: unknown[]): void;
  innerHTML: string;
}

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
