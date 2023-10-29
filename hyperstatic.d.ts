type HSContext = {
  document: Document;
  normalizeAttrs?: boolean;
};

type Attrs = {
  [key: string]: string;
};

type Content = Node | string | number | boolean | object | Content[];

export type HyperStatic = {
  (spec: string, ...names: Content[]): Element;
  (spec: string, attrs: Attrs, ...names: Content[]): Element;
  document: Document;
  createElement(spec: string, attrs: Attrs, ...names: Content[]): Element;
};

export function hyperscript(context?: HSContext): HyperStatic;
