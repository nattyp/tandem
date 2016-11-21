import * as React from "react";
import { Workspace } from "@tandem/editor/browser";
import { DOMElements } from "@tandem/html-extension/collections";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { HashInputComponent } from "@tandem/html-extension/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticHTMLElement, SyntheticDOMAttribute, SyntheticDOMElementEdit } from "@tandem/synthetic-browser";

export class ElementAttributesPaneComponent extends BaseApplicationComponent<{ workspace: Workspace }, any> {

  addAttribute = () => {
    this.items.setAttribute("", "");
  }

  setAttribute = (name: string, value: any, oldName?: string) => {
    if(name != null) this.items.setAttribute(name, value);
    if (oldName != null) {
      this.items.removeAttribute(oldName);
    }

    for (const item of this.items) {
      const edit = item.createEdit() as SyntheticDOMElementEdit;
      edit.setAttribute(name, value, oldName);

      this.bus.dispatch(new ApplyFileEditRequest(edit.changes));
    }
  }

  get items(): DOMElements<any> {
    if (!this.props.workspace) return new DOMElements();
    const { selection } = this.props.workspace;
    return DOMElements.fromArray(selection);
  }

  render() {
    if (!this.props.workspace) return null;
    const items = this.items;
    if (!items.length) return null;

    return <div>
      <div className="header entity html property">
        Attributes
        <div className="controls">
          <span onClick={this.addAttribute}>+</span>
        </div>
      </div>
      { items.attributes.length ? <HashInputComponent items={items.attributes} setKeyValue={this.setAttribute} /> : this.renderAddButton() }
    </div>;
  }

  renderAddButton() {

    // TODO: temporary - make this prettier.
    return <div className="container">
      <div onClick={this.addAttribute} style={{ cursor: "pointer" }}>Add one</div>
    </div>;
  }
}
