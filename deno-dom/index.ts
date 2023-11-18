import { Document } from "deno-dom";
import { hyperstatic } from "../hyperstatic.ts";

/**
 * A {@link hyperstatic} instance using DenoDOM.
 */
export const h = hyperstatic({
  document: new Document(),
});
