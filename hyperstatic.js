import { parse } from "./spec.js";

function isNode(o) {
  // borrowed from hyperscript
  return o && o.nodeType && o.nodeName;
}

function normalizeAttr(name) {
  return name.replace(/(?<=.)[A-Z]/g, '-$&').toLowerCase();
}

/**
 * Context for a HyperStatic instance.
 * @typedef {Object} HSContext
 * @property {Document} document - a root document that will own created nodes.
 */

/**
 * Type of HyperStatic child content.
 * @typedef {(Node|string|number|boolean|object|content[])} content
 */

/**
 * Type for HyperStatic implementations.  An implementation is a function,
 * compatible with the usual hyperscript `h`. The function object has methods
 * and properties exposing additional functionality.
 * @typedef {Function} HyperStatic
 * @param {string} spec - the element specifier
 * @param {object} [attrs] - the attributes
 * @param {...content} content - the content
 * @property {CreateElement} createElement - React-compatible `createElement` method
 * @property {Document} document - the document in which elements are created
 */

/**
 * Type for React-compatible `createElement` functions.
 * @typedef {Function} CreateElement
 * @param {string} name - the element name
 * @param {?object} attrs - the element attributes
 * @param {...content} content - the element content
 * @returns {Element} the constructed element
 */

/**
 * Create a HyperStatic instance from a context.
 * @param {HSContext?} context - the context to use (e.g. `window`).
 * @returns {HyperStatic}the hyperstatic implementation.
 */
export function hyperstatic(context) {
  if (!context) context = window;
  let { document } = context;

  function createElement(name, attrs, ...content) {
    let elt = document.createElement(name);
    for (let k in attrs) {
      elt.setAttribute(normalizeAttr(k), attrs[k]);
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
