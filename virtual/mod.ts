/**
 * Hyperstatic with a virtual DOM.  Much like Hastscript, but interoperates with
 * DOM trees.
 */
import { VirtualContext } from "./context.ts";
export { VirtualContext };
export type { VDElement, VDNode } from "./vdom.ts";
export { render as renderDOM } from "./render.ts";
import { makeHyper } from "../core/hyper.ts";
import { HyperStatic } from "../core/defs.ts";
import { VDElement, VDNode } from "./vdom.ts";

/**
 * A {@link hyperstatic} using the virtual DOM.
 */
export const h: HyperStatic<VDNode, VDElement> = makeHyper(new VirtualContext());
