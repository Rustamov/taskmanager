import {createElement} from "../utils/render";

export default class AbstatctComponent {
  constructor() {
    if (new.target === AbstatctComponent) {
      throw new Error(`Can't instantiate AbstatctComponent, only concrete one.`);
    }

    this._element = null;
  }

  getElement() {
    throw new Error(`Abstract method not implemented: getTempate.`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }
  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }
}
