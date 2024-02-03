export const VD_ELEMENT_TAG = Symbol("vdom-element");

export interface DNode {
  nodeType: number;
  nodeName: string;
  ownerDocument: unknown;
}

export interface VDElement {
  [VD_ELEMENT_TAG]: true;
  name?: string;
  attributes: {
    [key: string]: string;
  };
  innerHTML?: string;
  children: VDNode[];
}

export type VDNode = VDElement | string | DNode;

export function isVDElement(obj: VDNode): obj is VDElement {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, VD_ELEMENT_TAG);
}
