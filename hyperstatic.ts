import { parse } from "./spec.js";

interface HDocument<N extends HNode<N>, E extends HElement & N> {
  createElement(name: string): E;
  createTextNode(text: string): N;
}

interface HNode<N> {
  appendChild(node: N): void;
}

interface HElement {
  setAttribute(name: string, value: string): void;
}

interface HSContext<D extends HDocument<N, E>, N extends HNode<N>, E extends HElement & N> {
  document: D;
  normalizeAttrs?: boolean;
}

interface Stringable {
  toString(): string;
}

type Attrs = {
  [key: string]: string | Stringable;
};

type Content<N> = N | string | Stringable | Content<N>[];

export type HyperStatic<D, N, E extends N> = {
  (spec: string, ...names: Content<N>[]): E;
  (spec: string, attrs: Attrs, ...names: Content<N>[]): E;
  document: D;
  createElement(spec: string, attrs: Attrs, ...names: Content<N>[]): E;
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

  function createElement(name: string, attrs: Attrs, ...content: Content<HNode<N>>[]) {
    let elt = document.createElement(name);
    for (let k in attrs) {
      let name = k;
      if (normalize) {
        name = normalizeAttr(name);
      }
      elt.setAttribute(name, attrs[k].toString());
    }
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
      } else {
        elt.appendChild(document.createTextNode(x.toString()));
      }
    }

    return elt;
  }

  // deno-lint-ignore no-explicit-any
  function h(name: string, attrs: any, ...content: Content<N>[]) {
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

  h.createElement = createElement;
  h.document = document;
  return h;
}

/**
 * Default HyperStatic implementation using the document from the global `window` object.
 * @type {HyperStatic}
 */
export const h: HyperStatic<Document, Node, Element> = hyperstatic(window);
export default h;
