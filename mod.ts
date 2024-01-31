import { HSAttrs, HSContent, HSContext, HyperStatic } from "./core/defs.ts";
import { HyperFactory, HyperOptions } from "./core/factory.ts";
import { hyperstatic as makeHyper } from "./core/hyper.ts";
import { DOMContext, DOMDocument, HElement, HNode } from "./core/dom.ts";

export type { HSAttrs, HSContent, HSContext, HyperOptions, HyperStatic };
export { DOMContext, HyperFactory };

/**
 * Construct a hyperstatic instance from a context, factory, or DOM document.
 */
export function hyperstatic<N, E extends N>(
  ctx: HSContext<N, E>,
  options?: HyperOptions,
): HyperStatic<N, E>;
export function hyperstatic<N, E extends N>(
  factory: HyperFactory<N, E>,
  options?: HyperOptions,
): HyperStatic<N, E>;
export function hyperstatic<
  N extends HNode<N, E>,
  E extends HElement<N, E> & N,
  D extends DOMDocument<N, E>,
>(doc: D): HyperStatic<N, E>;
export function hyperstatic<N, E extends N>(
  // deno-lint-ignore no-explicit-any
  cof: any,
  options?: HyperOptions,
): HyperStatic<N, E> {
  if (cof.nodeType && cof.nodeName) {
    cof = new DOMContext(cof);
  }
  return makeHyper(cof, options);
}
