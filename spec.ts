/**
 * Parsed elemenet specifiers.
 */
export type ElementSpec = {
  name: string;
  id?: string;
  classes?: string[];
};

/**
 * Parse a Hyperscript-style element specifier.
 *
 * This function is only exported for testing.
 *
 * @param spec a Hyperscript-style element specifier with optional classes and ID.
 */
export function parse(spec: string): ElementSpec {
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
