/**
 * Hyperstatic with a virtual DOM.  Much like Hastscript, but interoperates with
 * DOM trees.
 */
import { VirtualContext } from "./context.ts";
export { VirtualContext };
export type { VDElement, VDNode } from "./vdom.ts";
export { render as renderDOM } from "./render.ts";
import { hyperstatic } from "../core/hyper.ts";

/**
 * A {@link hyperstatic} using the virtual DOM.
 */
export const h = hyperstatic(new VirtualContext());
