import { HSAttrs, HSContext, HSNode, HyperStatic } from "./core/defs.ts";
import { HyperFactory, HyperOptions } from "./core/factory.ts";
import { hyperstatic as makeHyper } from "./core/hyper.ts";
import { DOMContext, DOMDocument, DOMNode } from "./core/dom.ts";

export type { HSAttrs, HSContext, HSNode, HyperOptions, HyperStatic };
export { DOMContext, HyperFactory };

/**
 * Construct a hyperstatic instance from a context, factory, or DOM document.
 */
export function hyperstatic<N>(
  ctx: HSContext<N>,
  options?: HyperOptions,
): HyperStatic<N>;
export function hyperstatic<N>(
  factory: HyperFactory<N>,
  options?: HyperOptions,
): HyperStatic<N>;
export function hyperstatic<
  N extends DOMNode<N>,
  D extends DOMDocument<N>,
>(doc: D): HyperStatic<N>;
export function hyperstatic<N>(
  // deno-lint-ignore no-explicit-any
  cof: any,
  options?: HyperOptions,
): HyperStatic<N> {
  if (cof.nodeType && cof.nodeName) {
    cof = new DOMContext(cof);
  }
  return makeHyper(cof, options);
}
