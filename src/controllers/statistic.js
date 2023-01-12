// import LoadMoreButtonComponent from '../components/load-more-button';
// import NoTasksComponent from '../components/no-tasks';
// import SortComponent, {SortType} from '../components/sort';
// import TaskController, {Mode as TaskControllerMode, EmptyTask} from './task';
// import TasksComponent from '../components/tasks';

import StatisticsComponent from '../components/statistics';


import {RenderPosition, render, remove} from '../utils/render';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;


const renderTasks = (tasksListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(tasksListElement, onDataChange, onViewChange);

    taskController.render(task, TaskControllerMode.DEFAULT);

    return taskController;
  });
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class StatisticController {
  constructor(containerElement, tasksModel) {
    this._containerElement = containerElement;
    this._tasksModel = tasksModel;

    this._statisticsComponent = new StatisticsComponent();
    // this._onFilterChange = this._onFilterChange.bind(this);

    // this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    render(this._containerElement, this._statisticsComponent, RenderPosition.BEFOREEND);

    this._buildGraphic();
  }

  _buildGraphic() {
    const canvas = this._statisticsComponent.getElement().querySelector(`.statistic__days`);

    console.log(this._tasksModel);
    console.log(canvas);
  }

  show() {
    this._statisticsComponent.show();
  }
  hide() {
    this._statisticsComponent.hide();
  }


}
