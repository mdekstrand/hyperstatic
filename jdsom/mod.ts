/// <reference lib="dom" />
import { JSDOM } from "jsdom";
import { HyperStatic } from "../core/defs.js";
import { DOMContext } from "../core/dom.js";
import { makeHyper } from "../core/hyper.js";

// export { Document, DocumentFragment, Element, Node };

export type JSDHyperStatic = HyperStatic<Node, Element>;
export type JSDContext = DOMContext<Node, Element, Document>;

export function makeHyperJS(): HyperStatic<Node, Element> {
  return makeHyper<Node, Element>(
    new DOMContext<Node, Element, Document>(new JSDOM("").window.document),
  );
}

/**
 * A {@link makeHyper} instance using DenoDOM.
 */
export const h: HyperStatic<Node, Element> = makeHyperJS();
