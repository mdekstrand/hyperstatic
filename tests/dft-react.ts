import { Document } from "deno-dom";
import { hyperstatic } from "../hyperstatic.ts";

export const React = hyperstatic({
  document: new Document(),
});

export default React;
