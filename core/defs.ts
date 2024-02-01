interface Stringable {
  toString(): string;
}

export type HSAttrs = {
  [key: string]: string | Stringable | true | null | undefined;
};

export type HSContent = string | Stringable | null | undefined;

export type HSNode<N> = N | HSContent | HSNode<N>[];

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
  isNode(o: HSNode<Node>): o is Node;
}

export type Component<E, T> = (props: T) => E;

export type JSXProps<N> = HSAttrs & {
  dangerouslySetInnerHTML?: string;
  children?: HSNode<N>[];
};

export interface HyperStatic<N, E extends N> {
  (spec: string, ...children: HSNode<N>[]): E;
  (spec: string, attrs: HSAttrs, ...children: HSNode<N>[]): E;

  Fragment: symbol;
  createElement(spec: string | symbol, attrs?: HSAttrs, ...children: HSNode<N>[]): N;

  jsx(name: string | symbol, props?: JSXProps<N>, key?: unknown): N;
  jsx<T>(comp: Component<E, T>, props: T, key?: unknown): N;
  jsxs(name: string | symbol, props?: JSXProps<N>, key?: unknown): N;
}
