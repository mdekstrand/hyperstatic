import { Component, HSAttrs, HSContent, HSContext, JSXProps } from "./defs.ts";

export type HyperOptions = {
  normalizeAttrs?: boolean;
};

function normalizeAttr(name: string): string {
  return name.replace(/(?<=.)[A-Z]/g, "-$&").toLowerCase();
}

export class HyperFactory<N, E extends N> {
  context: HSContext<N, E>;
  options: HyperOptions;

  constructor(ctx: HSContext<N, E>, opts: HyperOptions) {
    this.context = ctx;
    this.options = opts;

    // bind exposed methods
    this.createElement = this.createElement.bind(this);
    this.jsx = this.jsx.bind(this);
  }

  appendChildren(elt: E, content?: HSContent<N, E>[]) {
    const ctx = this.context;
    content ??= [];
    let lstack = [];
    let cl = {
      pos: 0,
      content,
    };

    while (cl.pos < cl.content.length || lstack.length) {
      if (cl.pos >= cl.content.length) {
        cl = lstack.pop()!;
        continue; // loop back around, because we might have popped an empty!
      }
      // get the next element of the current level
      let x = cl.content[cl.pos];
      cl.pos += 1;
      // process it
      if (x == null) {
        continue;
      } else if (typeof x == "string") {
        ctx.appendChild(elt, ctx.createTextNode(x));
      } else if (ctx.isNode(x)) {
        ctx.appendChild(elt, x);
      } else if (Array.isArray(x)) {
        lstack.push(cl);
        cl = { pos: 0, content: x };
      } else {
        ctx.appendChild(elt, ctx.createTextNode(x.toString()));
      }
    }
  }

  create<T>(
    name: string | symbol | Component<E, T>,
    props?: JSXProps<N, E> | T,
  ): { elt: E; final: boolean } {
    const ctx = this.context;
    let elt: E | undefined;
    if (name == ctx.Fragment) {
      // FIXME: this only works on DOM
      // deno-lint-ignore no-explicit-any
      let tmpl = ctx.createElement("template") as any;
      elt = tmpl.content;
    } else if (typeof name == "string") {
      elt = ctx.createElement(name);
    } else if (typeof name == "function") {
      return { elt: name(props as T), final: true };
    } else {
      throw new Error(`unsupported element ${name.toString()}`);
    }

    props ??= {};
    for (let k in props) {
      if (k == "children" || k == "dangerouslySetInnerHTML") continue;
      let name = k;
      if (this.options.normalizeAttrs) {
        name = normalizeAttr(name);
      }
      let val = (props as JSXProps<N, E>)[k];
      if (val === true) {
        ctx.setAttribute(elt!, name, "");
      } else if (val != null) {
        ctx.setAttribute(elt!, name, val.toString());
      }
    }
    return { elt: elt!, final: false };
  }

  jsx<T>(
    name: string | symbol | Component<E, T>,
    arg?: JSXProps<N, E> | T,
    _key?: unknown,
  ): N {
    let { elt, final } = this.create(name, arg);
    if (final) return elt;

    let props = arg as JSXProps<N, E>;
    if (props?.dangerouslySetInnerHTML) {
      this.context.setInnerHTML(elt, props.dangerouslySetInnerHTML);
    } else if (props?.children) {
      let children = Array.isArray(props.children) ? props.children : [props.children];
      this.appendChildren(elt, children);
    }
    return elt;
  }

  createElement(
    name: string | symbol,
    attrs?: HSAttrs,
    ...content: HSContent<N, E>[]
  ): N {
    return this.jsx(name, { children: content, ...attrs });
  }
}
