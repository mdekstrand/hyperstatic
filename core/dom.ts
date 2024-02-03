/**
 * Context and support types for using HyperScript with DOM implementations.  This works with
 * HTML DOM (browser built-in and deno-dom, probably others), as well as XML DOMs (tested
 * with xmldom).
 *
 * The document, node, and element types are designed to enable the context and resulting
 * hyperscript implementations to be generic over DOM implementations, but also type-safe
 * (a single instantiation limited to a single implementation).
 */
import { assert } from "std/assert/assert.ts";
import { HSContext, HSNode, HyperFragment } from "./defs.ts";

/**
 * Generic type for DOM documents.
 */
export interface DOMDocument<N extends DOMNode<N, E>, E extends N & DOMElement<N, E>> {
  createElement(name: string): E;
  createTextNode(text: string): N;
  importNode(node: N, deep?: boolean): N;
}

export interface DOMNode<N extends DOMNode<N, E>, E extends N & DOMElement<N, E>> {
  nodeType: number;
  nodeName: string;
  appendChild(node: N): N;
  ownerDocument: DOMDocument<N, E> | null;
}

export interface DOMElement<N extends DOMNode<N, E>, E extends N & DOMElement<N, E>>
  extends DOMNode<N, E> {
  id?: string;
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | null;
  innerHTML: string;
}

// deno-lint-ignore no-explicit-any
export function isDOMNode<N>(o: any): o is N {
  // borrowed from hyperscript
  return o && o.nodeType && o.nodeName;
}

export function isDOMElement<N extends DOMNode<N, E>, E extends N & DOMElement<N, E>>(
  n: DOMNode<N, E>,
): n is DOMElement<N, E> {
  return n.nodeType == 1;
}

/**
 * A HyperScript context that instantiates DOM nodes.
 */
export class DOMContext<
  N extends DOMNode<N, E>,
  E extends N & DOMNode<N, E> & DOMElement<N, E>,
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

  createFragment(): N {
    let tmpl = this.document.createElement("template");
    // @ts-ignore tmpl will be an HTMLTemplateElement with content
    return tmpl.content;
  }

  setAttribute(node: N, name: string, value: string): void {
    assert(isDOMElement(node));
    node.setAttribute(name, value);
  }

  appendChild(parent: N, child: N): void {
    if (parent.ownerDocument && child.ownerDocument !== parent.ownerDocument) {
      child = parent.ownerDocument.importNode(child, true);
    }
    parent.appendChild(child);
  }

  setInnerHTML(parent: N, html: string): void {
    assert(isDOMElement(parent));
    parent.innerHTML = html;
  }

  isNode(o: HSNode<N>): o is N {
    return isDOMNode(o);
  }

  isElement(o: HSNode<N>): o is E {
    return this.isNode(o) && isDOMElement(o);
  }
}
