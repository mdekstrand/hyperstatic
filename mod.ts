import { HSAttrs, HSContext, HSNode, HyperStatic } from "./core/defs.js";
import { HyperFactory, HyperOptions } from "./core/factory.js";
import { makeHyper } from "./core/hyper.js";
import { DOMContext, DOMDocument, DOMElement, DOMNode } from "./core/dom.js";

export type { HSAttrs, HSContext, HSNode, HyperOptions, HyperStatic };
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
  N extends DOMNode<N, E>,
  E extends N & DOMElement<N, E>,
  D extends DOMDocument<N, E>,
>(doc: D, options?: HyperOptions): HyperStatic<N, E>;
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
