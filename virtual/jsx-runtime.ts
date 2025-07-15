import { h } from "./mod.js";

export const jsx = h.jsx;
export const jsxs = h.jsxs;
export const Fragment = h.Fragment;

export namespace JSX {
  export interface IntrinsicElements {
    [name: string]: any;
  }
}
