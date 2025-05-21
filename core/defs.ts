export const HyperFragment = Symbol("HyperFragment");

interface Stringable {
  toString(): string;
}

export type HSAttrs = {
  [key: string]: string | Stringable | true | null | undefined;
};

export type HSText = string | number;
export type HSIgnore = undefined | null | boolean;

export type HSNode<N> = N | HSText | HSIgnore | HSNode<N>[];

export const FragmentSymbol = Symbol.for("hyperstatic.Fragment");

/**
 * Context for a HyperStatic implementation.
 */
export interface HSContext<Node, Element extends Node> {
  createElement(name: string): Element;
  createTextNode(text: string): Node;
  createFragment(): Node;
  setAttribute(node: Element, name: string, value: string): void;
  appendChild(parent: Node, child: Node): void;
  setInnerHTML(parent: Element, html: string): void;
  isNode(o: HSNode<Node>): o is Node;
  isElement(o: HSNode<Node>): o is Element;
}

export type Component<E, T> = (props: T) => E;

export type JSXProps<N> = HSAttrs & {
  dangerouslySetInnerHTML?: string;
  children?: HSNode<N>[];
};

export interface HyperStatic<N, E extends N> {
  (spec: string, ...children: HSNode<N>[]): E;
  (spec: string, attrs: HSAttrs, ...children: HSNode<N>[]): E;

  Fragment(props: { children?: HSNode<N>[] }): N;
  createElement(spec: string, attrs?: HSAttrs, ...children: HSNode<N>[]): E;
  createElement(spec: symbol, attrs?: HSAttrs, ...children: HSNode<N>[]): N;

  jsx(name: string | symbol, props?: JSXProps<N>, key?: unknown): N;
  jsx<T>(comp: Component<N, T>, props: T, key?: unknown): N;
  jsxs(name: string | symbol, props?: JSXProps<N>, key?: unknown): N;
}
