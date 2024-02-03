/**
 * VDom context.
 */
import { HSContext, HSNode, HyperFragment } from "../core/defs.ts";
import { isDOMNode } from "../core/dom.ts";
import { isVDElement, VD_ELEMENT_TAG, VDElement, VDNode } from "./vdom.ts";

export class VirtualContext implements HSContext<VDNode, VDElement> {
  Fragment = HyperFragment;

  createElement(name: string): VDElement {
    return {
      [VD_ELEMENT_TAG]: true,
      name,
      attributes: {},
      children: [],
    };
  }

  createTextNode(text: string): string {
    return text;
  }

  createFragment(): VDElement {
    return {
      [VD_ELEMENT_TAG]: true,
      attributes: {},
      children: [],
    };
  }

  setAttribute(node: VDElement, name: string, value: string) {
    node.attributes[name] = value;
  }

  appendChild(parent: VDElement, child: VDNode) {
    parent.children.push(child);
  }

  setInnerHTML(parent: VDElement, html: string): void {
    parent.innerHTML = html;
  }

  isNode(o: HSNode<VDNode>): o is VDNode {
    // deno-lint-ignore no-explicit-any
    return isVDElement(o as any) || isDOMNode(o) || typeof o == "string";
  }

  isElement(o: HSNode<VDNode>): o is VDElement {
    // deno-lint-ignore no-explicit-any
    return isVDElement(o as any);
  }
}
