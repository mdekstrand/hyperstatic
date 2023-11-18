import { parse } from "./spec.ts";

export const Fragment = Symbol("HyperFragment");

interface HDocument<N extends HNode<N>, E extends HElement & N> {
  createElement(name: string): E;
  createTextNode(text: string): N;
}

interface HNode<N> {
  appendChild(node: N): void;
}

interface HElement {
  setAttribute(name: string, value: string): void;
  append(...children: unknown[]): void;
  innerHTML: string;
}

export type HyperOptions = {
  normalizeAttrs?: boolean;
};

interface HSContext<D extends HDocument<N, E>, N extends HNode<N>, E extends HElement & N>
  extends HyperOptions {
  document: D;
}

interface Stringable {
  toString(): string;
}

export type HyperAttrs = {
  [key: string]: string | Stringable | null | undefined;
};

export type HyperContent<N> = N | string | Stringable | null | undefined | HyperContent<N>[];

export type JSXProps<N> = HyperAttrs & {
  dangerouslySetInnerHTML?: string;
  children?: HyperContent<N>[];
};

export type HyperStatic<D, N, E extends N> = {
  (spec: string, ...names: HyperContent<N>[]): E;
  (spec: string, attrs: HyperAttrs, ...names: HyperContent<N>[]): E;
  (spec: string, attrs: HyperAttrs | HyperContent<E>, ...names: HyperContent<N>[]): E;
  document: D;

  Fragment: symbol;
  createElement(spec: string | symbol, attrs?: HyperAttrs, ...names: HyperContent<N>[]): E;

  jsx(spec: string, props?: JSXProps<N>, key?: unknown): E;
  jsxs(spec: string, props?: JSXProps<N>, key?: unknown): E;
};

// deno-lint-ignore no-explicit-any
function isNode<N extends HNode<N>>(o: any): o is N {
  // borrowed from hyperscript
  return o && o.nodeType && o.nodeName;
}

function normalizeAttr(name: string): string {
  return name.replace(/(?<=.)[A-Z]/g, "-$&").toLowerCase();
}

/**
 * Create a HyperStatic instance from a context.
 * @param {HSContext?} context - the context to use (e.g. `window`).
 * @returns {HyperStatic}the hyperstatic implementation.
 */
export function hyperstatic<D extends HDocument<N, E>, N extends HNode<N>, E extends HElement & N>(
  context: HSContext<D, N, E>,
): HyperStatic<D, N, E> {
  let { document } = context;
  let normalize = context.normalizeAttrs ?? true;

  function appendChildren(elt: E, content?: HyperContent<N>[]) {
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
      if (typeof x == "string") {
        elt.appendChild(document.createTextNode(x));
      } else if (isNode<N>(x)) {
        elt.appendChild(x);
      } else if (Array.isArray(x)) {
        lstack.push(cl);
        cl = { pos: 0, content: x };
      } else if (x != null) {
        elt.appendChild(document.createTextNode(x.toString()));
      }
    }
  }

  function create(name: string | symbol, props?: JSXProps<N>): E {
    let elt: E | undefined;
    if (name == Fragment) {
      // deno-lint-ignore no-explicit-any
      let tmpl = document.createElement("template") as any;
      elt = tmpl.content;
    } else if (typeof name == "string") {
      elt = document.createElement(name);
    } else {
      throw new Error(`unsupproted element ${name.toString()}`);
    }

    props ??= {};
    for (let k in props) {
      if (k == "children" || k == "dangerouslySetInnerHTML") continue;
      let name = k;
      if (normalize) {
        name = normalizeAttr(name);
      }
      let val = props[k];
      if (val) {
        elt!.setAttribute(name, val.toString());
      }
    }
    return elt!;
  }

  function jsx(name: string | symbol, props?: JSXProps<N>, _key?: unknown): N {
    let elt = create(name, props);
    if (props?.dangerouslySetInnerHTML) {
      elt.innerHTML = props.dangerouslySetInnerHTML;
    } else if (props?.children) {
      let children = Array.isArray(props.children) ? props.children : [props.children];
      appendChildren(elt, children);
    }
    return elt;
  }

  function jsxs(name: string | symbol, props?: JSXProps<N>, _key?: unknown): N {
    let elt = create(name, props);
    if (props?.dangerouslySetInnerHTML) {
      elt.innerHTML = props.dangerouslySetInnerHTML;
    } else if (props?.children) {
      // deno-lint-ignore no-explicit-any
      elt.append(...props.children as any[]);
    }
    return elt;
  }

  function createElement(
    name: string | symbol,
    attrs?: HyperAttrs,
    ...content: HyperContent<HNode<N>>[]
  ) {
    return jsx(name, { children: content, ...attrs });
  }

  // deno-lint-ignore no-explicit-any
  function h(name: string, attrs: any, ...content: HyperContent<N>[]) {
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
    return createElement(spec.name, attrs, ...content);
  }

  h.Fragment = Fragment;
  h.createElement = createElement;
  h.jsx = jsx;
  h.jsxs = jsxs;
  h.document = document;
  return h;
}

/**
 * Default HyperStatic implementation using the document from the global `window` object.
 * @type {HyperStatic}
 */
export const h: HyperStatic<Document, Node, Element> = hyperstatic(window);
export default h;
