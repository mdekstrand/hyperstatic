/**
 * Hyperstatic with a virtual DOM.  Much like Hastscript, but interoperates with
 * DOM trees.
 */
export { VirtualContext } from "./context.ts";
export type { VDElement, VDNode } from "./vdom.ts";
export { render as renderDOM } from "./render.ts";
