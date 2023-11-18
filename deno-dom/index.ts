import { Document, DocumentFragment, Element, Node } from "deno-dom";
import { hyperstatic } from "../hyperstatic.ts";

export { Document, DocumentFragment, Element, Node };

/**
 * A {@link hyperstatic} instance using DenoDOM.
 */
export const h = hyperstatic({
  document: new Document(),
});
