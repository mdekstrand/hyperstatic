import { HyperStatic, hyperstatic } from "../hyperstatic.ts";

/**
 * Default HyperStatic implementation using the document from the global `window` object.
 * @type {HyperStatic}
 */
export const h: HyperStatic<Document, Node, Element> = hyperstatic(window);
export default h;
export const createElement = h.createElement;
export const Fragment = h.Fragment;
