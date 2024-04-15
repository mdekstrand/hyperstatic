import { Document, DocumentFragment, Element, Node } from "@b-fuze/deno-dom";
import { HyperStatic } from "../core/defs.ts";
import { hyperstatic } from "../core/hyper.ts";
import { DOMContext } from "../core/dom.ts";

export { Document, DocumentFragment, Element, Node };

export type DDHyperStatic = HyperStatic<Node, Element>;
export type DDContext = DOMContext<Node, Element, Document>;

/**
 * A {@link hyperstatic} instance using DenoDOM.
 */
export const h: HyperStatic<Node, Element> = hyperstatic<Node, Element>(
  new DOMContext<Node, Element, Document>(new Document()),
);
