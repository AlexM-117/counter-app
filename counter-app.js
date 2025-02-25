/**
 * Copyright 2025 Alexander Manbeck
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.count = 0;
    this.min = 0;
    this.max = 100;


    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      count: { type: Number, reflect: true},
      min: {type: Number, reflect: true},
      max: {type: Number, reflect: true}
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }

      :host([count="18"]), :host([count="21"]) {
        color: var(--ddd-theme-default-creekTeal);
      }

      :host([count="10"]), :host([count="25"]) {
        color: var(--ddd-theme-default-error);
      }

      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
        background-color: var(--ddd-theme-default-shrineMaxLight);
      }
      .counter {
        font-size: var(--counter-app-label-font-size, var(--ddd-font-size-xxl));
        background: var(--ddd-theme-default-shrineLight);
      }

      button {
        padding: 8px 16px;
        cursor: pointer;
        color: #000;
        background-color: var(--ddd-theme-default-roarLight);
      }

      button:hover, button:focus {
        background-color: var(--ddd-theme-default-success);
        color: var(--ddd-theme-default-white);
      }

      button:disabled {
        background-color: var(--ddd-theme-default-error);
        color: var(--ddd-theme-default-white);
        cursor: not-allowed;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <confetti-container id="confetti">
      <div class="wrapper">
        <div class="counter">${this.count}</div>
        <div class="buttons">
          <button class="decrease" @click="${this.decrease}" ?disabled="${this.min === this.count}">-1</button>
          <button class="reset" @click="${this.reset}">reset</button>
          <button class="increase" @click="${this.increase}" ?disabled="${this.max === this.count}">+1</button>
        </div>
      </div>
    </confetti-container>
    `;
  }

  increase() {
    if (this.count < this.max) {
      this.count++;
    }
  }

  decrease() {
    if (this.count > this.min) {
      this.count--;
    }
  }

  reset() {
    this.count = 0;
  }

  
updated(changedProperties) {
  if (super.updated) {
    super.updated(changedProperties);
  }
  if (changedProperties.has('count')) {
    if (this.count === 21) {
      this.makeItRain();
    }
  }
}

makeItRain() {
  // this is called a dynamic import. It means it won't import the code for confetti until this method is called
  // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
  // will only run AFTER the code is imported and available to us
  import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
    (module) => {
      // This is a minor timing 'hack'. We know the code library above will import prior to this running
      // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
      // this "hack" ensures the element has had time to process in the DOM so that when we set popped
      // it's listening for changes so it can react
      setTimeout(() => {
        // forcibly set the poppped attribute on something with id confetti
        // while I've said in general NOT to do this, the confetti container element will reset this
        // after the animation runs so it's a simple way to generate the effect over and over again
        this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
      }, 0);
    }
  );
}

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);