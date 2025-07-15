// deno-lint-ignore-file no-namespace
import { h } from "./mod.js";

export const jsx = h.jsx;
export const jsxs = h.jsxs;
export const Fragment = h.Fragment;

export namespace JSX {
  export interface IntrinsicElements {
    // deno-lint-ignore no-explicit-any
    [name: string]: any;
  }
}
