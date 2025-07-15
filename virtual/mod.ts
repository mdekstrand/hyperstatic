/**
 * Hyperstatic with a virtual DOM.  Much like Hastscript, but interoperates with
 * DOM trees.
 */
import { VirtualContext } from "./context.js";
export { VirtualContext };
export type { VDElement, VDNode } from "./vdom.js";
export { render as renderDOM } from "./render.js";
import { makeHyper } from "../core/hyper.js";
import { HyperStatic } from "../core/defs.js";
import { VDElement, VDNode } from "./vdom.js";

/**
 * A {@link hyperstatic} using the virtual DOM.
 */
export const h: HyperStatic<VDNode, VDElement> = makeHyper(new VirtualContext());
