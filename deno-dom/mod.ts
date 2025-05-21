import { Document, DocumentFragment, Element, Node } from "@b-fuze/deno-dom";
import { HyperStatic } from "../core/defs.ts";
import { makeHyper } from "../core/hyper.ts";
import { DOMContext } from "../core/dom.ts";

export { Document, DocumentFragment, Element, Node };

export type DDHyperStatic = HyperStatic<Node, Element>;
export type DDContext = DOMContext<Node, Element, Document>;

/**
 * A {@link makeHyper} instance using DenoDOM.
 */
export const h: HyperStatic<Node, Element> = makeHyper<Node, Element>(
  new DOMContext<Node, Element, Document>(new Document()),
);
