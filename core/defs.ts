interface Stringable {
  toString(): string;
}

export type HSAttrs = {
  [key: string]: string | Stringable | true | null | undefined;
};

export type HSContent<N, E> = N | E | string | Stringable | null | undefined | HSContent<N, E>[];

/**
 * Context for a HyperStatic implementation.
 */
export interface HSContext<Node, Element extends Node> {
  Fragment: symbol;

  createElement(name: string): Element;
  createTextNode(text: string): Node;
  setAttribute(node: Element, name: string, value: string): void;
  appendChild(parent: Element, child: Node): void;
  setInnerHTML(parent: Element, html: string): void;
  isNode(o: HSContent<Node, Element>): o is Node;
}

export type Component<E, T> = (props: T) => E;

export type JSXProps<N, E> = HSAttrs & {
  dangerouslySetInnerHTML?: string;
  children?: HSContent<N, E>[];
};

export interface HyperStatic<N, E extends N> {
  (spec: string, ...children: HSContent<N, E>[]): E;
  (spec: string, attrs: HSAttrs, ...children: HSContent<N, E>[]): E;

  Fragment: symbol;
  createElement(spec: string | symbol, attrs?: HSAttrs, ...children: HSContent<N, E>[]): N;

  jsx(name: string | symbol, props?: JSXProps<N, E>, key?: unknown): N;
  jsx<T>(comp: Component<E, T>, props: T, key?: unknown): N;
  jsxs(name: string | symbol, props?: JSXProps<N, E>, key?: unknown): N;
}
