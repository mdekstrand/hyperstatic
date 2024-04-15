// deno-lint-ignore-file no-window
import { DOMContext } from "../core/dom.ts";
import { HyperStatic, hyperstatic } from "../core/hyper.ts";

/**
 * Default HyperStatic implementation using the document from the global `window` object.
 * @type {HyperStatic}
 */
export const h: HyperStatic<Node, Element> = hyperstatic<Node, Element>(
  new DOMContext(window.document),
);
export default h;
export const createElement = h.createElement;
export const Fragment = h.Fragment;
