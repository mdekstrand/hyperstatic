import { Document, DocumentFragment, Element, Node } from "deno-dom";
import { hyperstatic } from "../core/hyper.ts";
import { DOMContext } from "../core/dom.ts";

export { Document, DocumentFragment, Element, Node };

/**
 * A {@link hyperstatic} instance using DenoDOM.
 */
export const h = hyperstatic(new DOMContext<Node, Element, Document>(new Document()));
