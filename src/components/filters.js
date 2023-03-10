import AbstractSmartComponent from "../components/abstract-smart-component";

const FILTER_ID_PREFIX = `filter__`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFlterMarkup = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${count === 0 ? `disabled` : ``}
      ${isChecked ? `checked` : ``}
    />
    <label for="filter__${name}" class="filter__label">
    ${name} <span class="filter__all-count">${count}</span></label
    >`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFlterMarkup(it, it.checked)).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

export default class Filter extends AbstractSmartComponent {
  constructor(filters) {
    super();
    this._filters = filters;

    this._filterChangeHandler = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });

    this._filterChangeHandler = handler;
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._filterChangeHandler);
    // this._subscribeOnEvents();
  }

  // rerender() {
  //   super.rerender();

  //   this._applyFlatpickr();
  // }
}

