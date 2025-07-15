import { Document, DocumentFragment, Element, Node } from "jsdom";
import { HyperStatic } from "../core/defs.js";
import { DOMContext } from "../core/dom.js";
import { makeHyper } from "../core/hyper.js";

export { Document, DocumentFragment, Element, Node };

export type DDHyperStatic = HyperStatic<Node, Element>;
export type DDContext = DOMContext<Node, Element, Document>;

/**
 * A {@link makeHyper} instance using DenoDOM.
 */
export const h: HyperStatic<Node, Element> = makeHyper<Node, Element>(
  new DOMContext<Node, Element, Document>(new Document()),
);
