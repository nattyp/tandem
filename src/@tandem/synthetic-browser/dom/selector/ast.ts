import { IASTNode, IRange, ISourceLocation, BaseExpression } from "@tandem/common";

import { SyntheticDOMElement } from "../markup";

export enum SelectorKind {
  CLASS_NAME = 1,
  ID_SELECTOR = CLASS_NAME + 1,
  TAG_NAME = ID_SELECTOR + 1,
  LIST = TAG_NAME + 1,
  ALL = LIST + 1,
  DESCENDENT = ALL + 1,
  CHILD = DESCENDENT + 1,
  ADJACENT = CHILD + 1,
  PROCEEDING = ADJACENT + 1,
  ATTRIBUTE = PROCEEDING + 1,
  PSEUDO_CLASS = ATTRIBUTE + 1,
  NESTED = PSEUDO_CLASS + 1,
  PSEUDO_ELEMENT = NESTED + 1,
  LITERAL = PSEUDO_ELEMENT + 1,
}

export interface ISelectorVisitor {
  visitClassNameSelector(expression: ClassNameSelectorExpression);
  visitIDSelector(expression: IDSelectorExpression);
  visitAllSelector(expression: AllSelectorExpression);
  visitTagNameSelector(expression: TagNameSelectorExpression);
  visitListSelector(expression: ListSelectorExpression);
  visitDescendentSelector(expression: DescendentSelectorExpression);
  visitChildSelector(expression: ChildSelectorExpression);
  visitAttributeSelector(expression: AttributeSelectorExpression);
  visitAdjacentSiblingSelector(expression: AdjacentSiblingSelectorExpression);
  visitPseudoClassSelector(expression: PseudoClassSelectorExpression);
  visitNestedSelector(expression: NestedSelectorExpression);
  visitLiteral(expression: SelectorLiteralExpression);
  visitPseudoElement(expression: PseudoElementExpression);
  visitProceedingSiblingSelector(expression: ProceedingSiblingSelectorExpression);
}

export abstract class SelectorExpression extends BaseExpression {
  abstract kind: SelectorKind;
  abstract accept(visitor: ISelectorVisitor);
}


export class SelectorLiteralExpression extends SelectorExpression {
  readonly kind = SelectorKind.LITERAL;
  constructor(readonly value, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitLiteral(this);
  }
}

// .item { }
export class ClassNameSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.CLASS_NAME;
  constructor(readonly className: string, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitClassNameSelector(this);
  }
}

// #item { }
export class IDSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.ID_SELECTOR;
  constructor(readonly id: string, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitIDSelector(this);
  }
}

// div { }
export class TagNameSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.TAG_NAME;
  constructor(readonly tagName: string, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitTagNameSelector(this);
  }
}

// div, span { }
export class ListSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.LIST;
  constructor(readonly selectors: SelectorExpression[], location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitListSelector(this);
  }
}

// * { }
export class AllSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.ALL;
  accept(visitor: ISelectorVisitor) {
    return visitor.visitAllSelector(this);
  }
}

// div span { }
export class DescendentSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.DESCENDENT;
  constructor(readonly ancestorSelector: SelectorExpression, readonly targetSelector: SelectorExpression, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitDescendentSelector(this);
  }
}

// div > span { }
export class ChildSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.CHILD;
  constructor(readonly parentSelector: SelectorExpression, readonly targetSelector: SelectorExpression, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitChildSelector(this);
  }
}

// div + span { }
export class AdjacentSiblingSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.ADJACENT;
  constructor(readonly startSelector: SelectorExpression, readonly targetSelector: SelectorExpression, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitAdjacentSiblingSelector(this);
  }
}

// div ~ span { }
export class ProceedingSiblingSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.PROCEEDING;
  constructor(readonly startSelector: SelectorExpression, readonly targetSelector: SelectorExpression, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitProceedingSiblingSelector(this);
  }
}

// [attribute]
// [attribute~=value]
// [attribute^=value]
// [attribute$=value]
// [attribute*=value]
export class AttributeSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.ATTRIBUTE;
  constructor(readonly name: string, readonly operator: string, readonly value: string, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitAttributeSelector(this);
  }
}

export abstract class PseudoSelectorExpression extends SelectorExpression {
  constructor(readonly name: string, readonly parameter: SelectorExpression, location: ISourceLocation) {
    super(location);
  }
}

export class PseudoClassSelectorExpression extends PseudoSelectorExpression {
  readonly kind = SelectorKind.PSEUDO_CLASS;
  accept(visitor: ISelectorVisitor) {
    return visitor.visitPseudoClassSelector(this);
  }
}

export class PseudoElementExpression extends PseudoSelectorExpression {
  readonly kind = SelectorKind.PSEUDO_ELEMENT;
  accept(visitor: ISelectorVisitor) {
    return visitor.visitPseudoElement(this);
  }
}

export class NestedSelectorExpression extends SelectorExpression {
  readonly kind = SelectorKind.NESTED;
  constructor(readonly parent: SelectorExpression, readonly child: SelectorExpression, location: ISourceLocation) {
    super(location);
  }
  accept(visitor: ISelectorVisitor) {
    return visitor.visitNestedSelector(this);
  }
}

