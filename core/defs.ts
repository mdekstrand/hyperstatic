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

/**
 * Context for a HyperStatic implementation.
 */
export interface HSContext<Node> {
  Fragment: symbol;

  createElement(name: string): Node;
  createTextNode(text: string): Node;
  createFragment(): Node;
  setAttribute(node: Node, name: string, value: string): void;
  appendChild(parent: Node, child: Node): void;
  setInnerHTML(parent: Node, html: string): void;
  isNode(o: HSNode<Node>): o is Node;
}

export type Component<E, T> = (props: T) => E;

export type JSXProps<N> = HSAttrs & {
  dangerouslySetInnerHTML?: string;
  children?: HSNode<N>[];
};

export interface HyperStatic<N> {
  (spec: string, ...children: HSNode<N>[]): N;
  (spec: string, attrs: HSAttrs, ...children: HSNode<N>[]): N;

  Fragment: symbol;
  createElement(spec: string | symbol, attrs?: HSAttrs, ...children: HSNode<N>[]): N;

  jsx(name: string | symbol, props?: JSXProps<N>, key?: unknown): N;
  jsx<T>(comp: Component<N, T>, props: T, key?: unknown): N;
  jsxs(name: string | symbol, props?: JSXProps<N>, key?: unknown): N;
}
