export interface DOMDocument<N, E extends N> {
  createElement(name: string): E;
  createTextNode(text: string): N;
  importNode(node: N, deep?: boolean): N;
}

export interface HNode<N, E extends N> {
  nodeType: number;
  nodeName: string;
  appendChild(node: N): HNode<N, E>;
  ownerDocument: DOMDocument<N, E> | null;
}

export interface HElement<N, E extends N> extends HNode<N, E> {
  setAttribute(name: string, value: string): void;
  append(...children: unknown[]): void;
  innerHTML: string;
}
