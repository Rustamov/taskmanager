import FilterComponent from '../components/filters';

import {RenderPosition, render, replace} from '../utils/render';
import {getTasksByFilter} from '../utils/filter';
import {FilterType} from "../const";

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
  }

  render() {

    const oldFilterComponent = this._filterComponent;

    const container = this._container.getElement();
    const allTasks = this._tasksModel.getTasksAll();


    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: this._activeFilterType === filterType,
      };
    });

    this._filterComponent = new FilterComponent(filters);

    this._filterComponent.setFilterChangeHandler((filterType) => {
      this._tasksModel.setFilterType(filterType);
    });

    if (oldFilterComponent) {
      replace(this._filterComponent, oldFilterComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREBEGIN);
    }

  }

  _onFilterChange(filterType) {
    this._tasksModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
