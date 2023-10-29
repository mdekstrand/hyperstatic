import { parse } from "./spec.js";

function isNode(o) {
  // borrowed from hyperscript
  return o && o.nodeType && o.nodeName;
}

function normalizeAttr(name) {
  return name.replace(/(?<=.)[A-Z]/g, "-$&").toLowerCase();
}

/**
 * Create a HyperStatic instance from a context.
 * @param {HSContext?} context - the context to use (e.g. `window`).
 * @returns {HyperStatic}the hyperstatic implementation.
 */
export function hyperstatic(context) {
  // if (!context) context = window;
  let { document } = context;
  let normalize = context.normalizeAttrs ?? true;

  function createElement(name, attrs, ...content) {
    let elt = document.createElement(name);
    for (let k in attrs) {
      let name = k;
      if (normalize) {
        name = normalizeAttr(name);
      }
      elt.setAttribute(name, attrs[k]);
    }
    let lstack = [];
    let cl = {
      pos: 0,
      content,
    };

    while (cl.pos < cl.content.length || lstack.length) {
      if (cl.pos >= cl.content.length) {
        cl = lstack.pop();
        continue; // loop back around, because we might have popped an empty!
      }
      // get the next element of the current level
      let x = cl.content[cl.pos];
      cl.pos += 1;
      // process it
      if (typeof x == "string") {
        elt.appendChild(document.createTextNode(x));
      } else if (isNode(x)) {
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

  function h(name, attrs, ...content) {
    // handle name and initial classes
    let spec = parse(name);

    // are attributes attributes, or are they content?
    if (attrs && (typeof attrs != "object" || isNode(attrs) || Array.isArray(attrs))) {
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
export const h = hyperstatic(window);
export default h;
