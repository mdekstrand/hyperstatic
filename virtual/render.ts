/**
 * Render a virtual DOM to a real DOM.
 */

import { isVDElement, VDNode } from "./vdom.ts";
import { DOMDocument, DOMNode, isDOMNode } from "../core/dom.ts";
import { fail } from "std/assert/fail.ts";

/**
 * Render a VDOM node to a DOM node in a particular document.
 *
 * This document returns the created node, *unless* `vnode` is a fragment and
 * `parent` is supplied. In that case, the parent is returned.  If no parent
 * is supplied, then a fragment `vnode` renders to a document fragment node.
 *
 * @param vnode The VDOM node to render.
 * @param doc The document.
 * @param parent The parent node; if supplied, the translated VDOM node will
 * be added as a child of this node.
 * @returns The created node.
 */
export function render<
  N extends DOMNode<N>,
  D extends DOMDocument<N>,
>(vnode: VDNode, doc: D, parent?: N): N {
  let node;
  let append = parent !== undefined;
  let children: VDNode[] = [];
  if (typeof vnode == "string") {
    node = doc.createTextNode(vnode);
  } else if (isVDElement(vnode)) {
    if (vnode.name) {
      node = doc.createElement(vnode.name);
      for (let k in vnode.attributes) {
        if (Object.prototype.hasOwnProperty.call(vnode.attributes, k)) {
          node.setAttribute(k, vnode.attributes[k]);
        }
      }
    } else if (parent) {
      node = parent;
      append = false;
    } else {
      let tmpl = doc.createElement("template");
      // @ts-ignore no template
      node = tmpl.content;
    }
    children = vnode.children;
  } else if (isDOMNode<N>(vnode)) {
    node = vnode;
  } else {
    fail("unexpected vnode kind");
  }

  // we add *first*, to avoid recursive updates to children
  // that's the huge benefit of our vdom
  if (append) {
    parent!.appendChild(node);
  }

  if (isVDElement(vnode) && vnode.innerHTML) {
    node.innerHTML = vnode.innerHTML;
  }

  for (let kid of children) {
    render(kid, doc, node);
  }

  return node;
}
