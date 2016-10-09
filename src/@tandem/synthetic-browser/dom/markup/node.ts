import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { MarkupNodeExpression } from "./ast";
import { IModule, ISynthetic } from "@tandem/sandbox";

import {
  TreeNode,
  Metadata,
  BubbleBus,
  IASTNode,
  IComparable,
  findTreeNode,
  patchTreeNode,
} from "@tandem/common";

import {
  IMarkupModule,
} from "@tandem/synthetic-browser/sandbox";

import {
  MarkupNodeType
} from "./node-types";

import { ISyntheticComponent } from "../../components";

let _i = 0;

export interface IDOMNode extends TreeNode<any>, IComparable {
  uid: string;
  firstChild: IDOMNode;
  lastChild: IDOMNode;
  nextSibling: IDOMNode;
  previousSibling: IDOMNode;
  insertBefore(newChild: IDOMNode, existingChild: IDOMNode);
  replaceChild(child: IDOMNode, existingChild: IDOMNode);
  nodeType: number;
  nodeName: string;
  appendChild(child: IDOMNode);
  removeChild(child: IDOMNode);
}

export abstract class SyntheticDOMNode extends TreeNode<SyntheticDOMNode> implements IComparable, ISynthetic, IDOMNode {

  public target: ISyntheticComponent;

  readonly namespaceURI: string;

  /**
   * Unique id for the node -- used particularly for matching rendered DOM nodes
   * with with their synthetic versions.
   */

  protected _uid: string;

  /**
   * TRUE if the node has been loaded
   */

  private _loaded: boolean;

  /**
   * extra information specific to the environment that this node is running un
   */

  private _metadata: Metadata;

  /**
   * The source expression that generated this node. May be NULL at times
   * depending on the environment
   */

  public expression: MarkupNodeExpression;

  /**
   * The DOM node type
   */

  abstract readonly nodeType: number;

  /**
   */

  public module: IMarkupModule;


  private _targetNode: SyntheticDOMNode;
  private _targetDocument: SyntheticDocument;


  constructor(readonly nodeName: string, public ownerDocument: SyntheticDocument) {
    super();

    this._metadata = new Metadata();
    this._uid = Date.now() + "." + String(++_i);

    // similar to dataset -- specific to the editor
    this._metadata.observe(new BubbleBus(this));
  }

  get childNodes() {
    return this.children;
  }

  get uid() {
    return this._uid;
  }

  get metadata() {
    return this._metadata;
  }

  get parentElement(): HTMLElement {
    const parent = this.parentNode;
    if (!parent || parent.nodeType !== MarkupNodeType.ELEMENT) {
      return null;
    }
    return parent as any as HTMLElement;
  }

  get parentNode() {
    return this.parent;
  }

  addEventListener() {
    // TODO
  }

  contains(node: IDOMNode) {
    return !!findTreeNode(this, child => (<IDOMNode><any>child) === node);
  }

  abstract textContent: string;

  compare(source: IDOMNode) {
    return Number(source.constructor === this.constructor && this.nodeName === source.nodeName);
  }

  removeEventListener() {
    // TODO
  }

  // isDefaultNamespace(namespaceURI: string) {
  //   return this.namespaceURI === namespaceURI;
  // }

  isEqualNode(node: IDOMNode) {
    return !!this.compare(node);
  }

  isSameNode(node: IDOMNode) {
    return (<IDOMNode><any>this) === node;
  }

  hasChildNodes() {
    return this.childNodes.length !== 0;
  }


  abstract accept(visitor: IMarkupNodeVisitor);
  abstract cloneNode();
}