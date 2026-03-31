import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { onInterval } from "../lib/utils/onInterval";

@customElement("changing-word")
export class ExpandableToggle extends LitElement {
  @property({
    attribute: "data-secondary-words",
    converter: {
      fromAttribute: (value) => value && JSON.parse(value),
    },
  })
  secondaryWords: Array<string> = [];

  /** duration for a word of 10 letters estimated around 1700ms */
  @property({
    attribute: "data-interval",
    type: Number,
  })
  interval: number = 1700;

  @property({
    attribute: "data-delay",
    type: Number,
  })
  delay: number = 500;

  @property({ attribute: "data-shuffle-words" })
  shuffleWords: boolean = false;

  @property({ attribute: "data-initial-transition" })
  initialTransition: boolean = false;

  @state()
  protected _words: Array<string> = [];

  @state()
  protected _activeIndex: number = 0;

  @state()
  protected _activeWord: string | null | undefined;

  @state()
  protected _clearInterval: undefined | (() => void);

  private _animateEnteringWord() {
    const activeWordRef = this.renderRoot.querySelector(
      ".word.active"
    ) as HTMLElement;

    activeWordRef.style.transition = "none";
    activeWordRef.classList.add("entering");
    requestAnimationFrame(() => {
      activeWordRef.classList.remove("entering");
      activeWordRef.removeAttribute("style");
    });
  }

  private _scaleSpaceHolder({
    withoutTransition,
  }: { withoutTransition?: boolean } = {}) {
    const spaceHolderRef = this.renderRoot.querySelector(
      ".space-holder"
    ) as HTMLElement;
    const activeWordRef = this.renderRoot.querySelector(
      ".word.active"
    ) as HTMLElement;

    const targetWidth =
      activeWordRef.offsetWidth -
      0.1; /* - 0.1px to mitigate inline-flex rounding compared to inline */
    if (!withoutTransition) {
      spaceHolderRef.style.width = `${targetWidth}px`;
    } else {
      spaceHolderRef.style.transition = "none";
      spaceHolderRef.style.width = `${targetWidth}px`;
      spaceHolderRef.style.removeProperty("transition");
    }
  }

  nextWord() {
    this._activeIndex = (this._activeIndex + 1) % this._words.length;
    this._activeWord = this._words[this._activeIndex];
    this.requestUpdate();
  }

  protected firstUpdated() {
    if (!this.firstChild?.textContent) return;

    this._words = [this.firstChild.textContent, ...this.secondaryWords];
    this._activeWord = this._words[this._activeIndex];

    this._clearInterval = onInterval(
      () => {
        this.nextWord();
      },
      {
        duration: this.interval,
        delay: this.delay,
      }
    );
  }

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has("_activeWord")) {
      const previousActiveWord = changedProperties.get("_activeWord");
      const noPreviousActiveWord =
        previousActiveWord === null || previousActiveWord === undefined;
      const withTransition =
        !noPreviousActiveWord ||
        (noPreviousActiveWord && this.initialTransition);

      if (withTransition) {
        this._animateEnteringWord();
        this._scaleSpaceHolder();
      } else {
        this._scaleSpaceHolder({ withoutTransition: true });
      }
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearInterval?.();
  }

  render() {
    return html`${this._words.map(
        (word) => html`<span
          class=${this._activeWord === word ? "word active" : "word inactive"}
          >${word}</span
        >`
      )} <span class="space-holder"></span>`;
  }

  static styles = css`
    :host,
    .word,
    .word.active {
      text-decoration: inherit;
      text-decoration-color: inherit;
      text-underline-offset: inherit;
    }

    :host {
      position: relative;
      display: inline-block;
      will-change: width;
    }

    .word {
      position: absolute;
      left: 0px;
      top: 0px;
      transition: all 350ms ease;
    }

    .word.inactive {
      visibility: hidden;
      opacity: 0;
    }

    .word.active.entering {
      opacity: 0;
      transform: translateX(-1.5ch);
    }

    .word.active {
      visibility: visible;
      opacity: 1;
    }

    /* TODO:
    - expose transition(s) with CSS custom properties
    - add "next-word" or "active-word-in" class for having different transitions for in and out
    */

    .space-holder {
      display: inline-block;
      will-change: width;
      height: 0.5em;
      transition: 350ms ease-in-out;
    }
  `;
}
