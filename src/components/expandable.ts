import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

const defaultExpandableContentId = "expandable-content";

@customElement("expandable-toggle")
export class ExpandableToggle extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ attribute: "data-expandable-content-id" })
  expandableContentId?: string = defaultExpandableContentId;

  @property({ attribute: "data-expanded", type: String, reflect: true })
  expanded?: boolean = false;

  private _toggleExpanded() {
    this.expanded = !this.expanded;

    this.dispatchEvent(
      new CustomEvent(`toggled-expandable:${this.expandableContentId}`, {
        detail: {
          value: this.expanded,
        },
        bubbles: true,
      })
    );
  }

  // Render the UI as a function of component state
  render() {
    return html`
      <button
        aria-expanded=${this.expanded}
        aria-controls=${this.expandableContentId}
        @click=${this._toggleExpanded}
        type="button"
        part="button"
      >
        <slot></slot>
      </button>
    `;
  }

  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      display: contents;
      /* outline: none; /* Prevent duplicate outline on the host */
    }

    button {
      all: inherit;
      appearance: none;
      background: var(--expandable-toggle-collapsed-background, transparent);

      &[aria-expanded="true"] {
        background: var(--expandable-toggle-expanded-background);
      }

      cursor: pointer;
    }
    button:focus-visible {
      outline-offset: var(--focus-visible-outline-offset);
      outline: var(--focus-visible-outline, 3px solid blue);
    }
  `;
}

@customElement("expandable-content")
export class ExpandableContent extends LitElement {
  @state()
  protected _expanded = false;

  private _handleToggle = (event?: CustomEventInit<{ value: boolean }>) => {
    if (Boolean(event?.detail?.value)) {
      // this.removeAttribute("class");
      this.removeAttribute("aria-hidden");
      this.removeAttribute("inert");
      this.setAttribute("open", "");
    } else {
      this.setAttribute("aria-hidden", "true");
      this.setAttribute("inert", "");
      this.removeAttribute("open");
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    this._handleToggle();
    document.addEventListener(
      `toggled-expandable:${this.id}`,
      this._handleToggle
    );
  }

  attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null
  ): void {
    super.attributeChangedCallback(name, old, value);

    if (name === "id" && value === null) {
      this.setAttribute("id", defaultExpandableContentId);
    }
  }

  disconnectedCallback(): void {
    console.log("disconnectedCallback", `toggled-expandable:${this.id}`);
    document.removeEventListener(
      `toggled-expandable:${this.id}`,
      this._handleToggle
    );
  }

  render() {
    return html`<slot></slot> `;
  }

  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host[open] {
      visibility: visible;
    }
    :host[aria-hidden="true"] {
      visibility: hidden;
    }
  `;
}
