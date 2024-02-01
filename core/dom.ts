/**
 * Context and support types for using HyperScript with DOM implementations.  This works with
 * HTML DOM (browser built-in and deno-dom, probably others), as well as XML DOMs (tested
 * with xmldom).
 *
 * The document, node, and element types are designed to enable the context and resulting
 * hyperscript implementations to be generic over DOM implementations, but also type-safe
 * (a single instantiation limited to a single implementation).
 */
import { HSContext, HyperFragment } from "./defs.ts";

/**
 * Generic type for DOM documents.
 */
export interface DOMDocument<N, E extends N> {
  createElement(name: string): E;
  createTextNode(text: string): N;
  importNode(node: N, deep?: boolean): N;
}

export interface DOMNode<N, E extends N> {
  nodeType: number;
  nodeName: string;
  appendChild(node: N): DOMNode<N, E>;
  ownerDocument: DOMDocument<N, E> | null;
}

export interface DOMElement<N, E extends N> extends DOMNode<N, E> {
  setAttribute(name: string, value: string): void;
  append(...children: unknown[]): void;
  innerHTML: string;
}

/**
 * A HyperScript context that instantiates DOM nodes.
 */
export class DOMContext<
  N extends DOMNode<N, E>,
  E extends DOMElement<N, E> & N,
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
