import { HSContent, HSContext, HyperStatic } from "./defs.ts";
import { HyperFactory } from "./factory.ts";

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
): HyperStatic<N, E> {
  let context = cof instanceof HyperFactory ? cof : new HyperFactory(cof);
  // deno-lint-ignore no-explicit-any
  function h(name: string, attrs: any, ...content: HSContent<N, E>[]) {
    // handle name and initial classes
    let spec = parse(name);

    // are attributes attributes, or are they content?
    if (!attrs) {
      attrs = {};
    } else if (typeof attrs != "object" || isNode(attrs) || Array.isArray(attrs)) {
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
    return createElement(spec.name, attrs, ...content) as any;
  }
}
