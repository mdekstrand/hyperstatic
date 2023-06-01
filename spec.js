/**
 * Element specifier.
 * @typedef {Object} ElementSpec
 * @property {string} name - the element name
 * @property {?string} id - the element ID
 * @property {?string[]} classes - the element classes
 */

/**
 * Parse a Hyperscript-style element specifier.
 *
 * This function is only exported for testing.
 *
 * @param {string} spec - a Hyperscript-style element specifier with optional classes and ID.
 * @returns {ElementSpec} - the parsed element specifier.
 */
export function parse(spec) {
  let id, classes, name;

  // do we have an id specifier?
  let hash = spec.indexOf("#");
  if (hash >= 0) {
    id = spec.slice(hash + 1);
    spec = spec.slice(0, hash);
  }

  // do we have classes?
  let parts = spec.split(".");
  name = parts[0];
  if (parts.length > 1) {
    classes = parts.slice(1);
  }

  return { name, id, classes };
}
