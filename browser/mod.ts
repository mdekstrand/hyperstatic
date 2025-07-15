// deno-lint-ignore-file no-window
import { DOMContext } from "../core/dom.js";
import { HyperStatic, makeHyper } from "../core/hyper.js";

/**
 * Default HyperStatic implementation using the document from the global `window` object.
 * @type {HyperStatic}
 */
export const h: HyperStatic<Node, Element> = makeHyper<Node, Element>(
  new DOMContext(window.document),
);
export default h;
export const createElement = h.createElement;
export const Fragment = h.Fragment;
