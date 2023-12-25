import { parse } from "./spec.ts";

export const Fragment = Symbol("HyperFragment");

interface HDocument<N extends HNode<N>, E extends HElement & N> {
  createElement(name: string): E;
  createTextNode(text: string): N;
  importNode(node: N, deep?: boolean): N;
}

interface HNode<N> {
  appendChild(node: N): void;
  ownerDocument: unknown;
}

interface HElement {
  ownerDocument: unknown;
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

export type Component<E, T> = (props: T) => E;

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
  createElement(spec: string | symbol, attrs?: HyperAttrs, ...names: HyperContent<N>[]): N;

  jsx(spec: string, props?: JSXProps<N>, key?: unknown): N;
  jsxs(spec: string, props?: JSXProps<N>, key?: unknown): N;
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
export function hyperstatic<
  D extends HDocument<N, E>,
  N extends HNode<N>,
  E extends (HElement & N),
>(
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
      if (x == null) {
        continue;
      } else if (typeof x == "string") {
        elt.appendChild(document.createTextNode(x));
      } else if (isNode<N>(x)) {
        let child = x.ownerDocument == document ? x : document.importNode(x, true);
        elt.appendChild(child);
      } else if (Array.isArray(x)) {
        lstack.push(cl);
        cl = { pos: 0, content: x };
      } else {
        elt.appendChild(document.createTextNode(x.toString()));
      }
    }
  }

  function create<T>(
    name: string | symbol | Component<E, T>,
    props?: JSXProps<N> | T,
  ): { elt: E; final: boolean } {
    let elt: E | undefined;
    if (name == Fragment) {
      // deno-lint-ignore no-explicit-any
      let tmpl = document.createElement("template") as any;
      elt = tmpl.content;
    } else if (typeof name == "string") {
      elt = document.createElement(name);
    } else if (typeof name == "function") {
      return { elt: name(props as T), final: true };
    } else {
      throw new Error(`unsupported element ${name.toString()}`);
    }

    props ??= {};
    for (let k in props) {
      if (k == "children" || k == "dangerouslySetInnerHTML") continue;
      let name = k;
      if (normalize) {
        name = normalizeAttr(name);
      }
      let val = (props as JSXProps<N>)[k];
      if (val === true) {
        elt!.setAttribute(name, "");
      } else if (val != null) {
        elt!.setAttribute(name, val.toString());
      }
    }
    return { elt: elt!, final: false };
  }

  function jsx<T>(
    name: string | symbol | Component<E, T>,
    arg?: JSXProps<N> | T,
    _key?: unknown,
  ): N {
    let { elt, final } = create(name, arg);
    if (final) return elt;

    let props = arg as JSXProps<N>;
    if (props?.dangerouslySetInnerHTML) {
      elt.innerHTML = props.dangerouslySetInnerHTML;
    } else if (props?.children) {
      let children = Array.isArray(props.children) ? props.children : [props.children];
      appendChildren(elt, children);
    }
    return elt;
  }

  function createElement(
    name: string | symbol,
    attrs?: HyperAttrs,
    ...content: HyperContent<HNode<N>>[]
  ): N {
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
    // returns an E, which is an N, but the type isn't letting us express that
    // deno-lint-ignore no-explicit-any
    return createElement(spec.name, attrs, ...content) as any;
  }

  h.Fragment = Fragment;
  h.createElement = createElement;
  h.jsx = jsx;
  h.jsxs = jsx;
  h.document = document;
  return h;
}

/**
 * Default HyperStatic implementation using the document from the global `window` object.
 * @type {HyperStatic}
 */
export const h: HyperStatic<Document, Node, Element> = hyperstatic(window);
export default h;
