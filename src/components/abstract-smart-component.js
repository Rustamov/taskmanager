import AbstatctComponent from "./abstract-component";

export default class AbstatctSamrtComponent extends AbstatctComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners.`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}
