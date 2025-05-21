import { HSContext, HSNode, HyperStatic } from "./defs.ts";
import { HyperFactory, HyperOptions } from "./factory.ts";
import { parse } from "./spec.ts";
export type { HyperStatic };

export function makeHyper<N, E extends N>(
  ctx: HSContext<N, E>,
  options?: HyperOptions,
): HyperStatic<N, E>;
export function makeHyper<N, E extends N>(
  factory: HyperFactory<N, E>,
  options?: HyperOptions,
): HyperStatic<N, E>;
export function makeHyper<N, E extends N>(
  cof: HSContext<N, E> | HyperFactory<N, E>,
  options?: HyperOptions,
): HyperStatic<N, E> {
  let factory = cof instanceof HyperFactory ? cof : new HyperFactory(cof, options ?? {});
  // deno-lint-ignore no-explicit-any
  function h(name: string, attrs: any, ...content: HSNode<N>[]) {
    // handle name and initial classes
    let spec = parse(name);

    // are attributes attributes, or are they content?
    if (!attrs) {
      attrs = {};
    } else if (typeof attrs != "object" || factory.context.isNode(attrs) || Array.isArray(attrs)) {
      content.unshift(attrs);
      attrs = {};
    }
    if (spec.id) {
      attrs.id = spec.id;
    }
    if (spec.classes) {
      let cstr = spec.classes.join(" ");
      if (attrs.class) {
        attrs.class += " " + cstr;
      } else {
        attrs.class = cstr;
      }
    }

    // and now we can create
    // returns an E, which is an N, but the type isn't letting us express that
    // deno-lint-ignore no-explicit-any
    return factory.createElement(spec.name, attrs, ...content) as any;
  }

  h.Fragment = () => factory.context.Fragment;
  h.createElement = factory.createElement;
  h.jsx = factory.jsx;
  h.jsxs = factory.jsx;

  return h;
}
