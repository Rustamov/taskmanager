import BoardComponent from './components/board';
import BoardController from './controllers/board';
import FilterController from './controllers/filter';

import SiteMenuComponent, {MenuItem} from './components/site-menu';
import StatisticsComponent from './components/statistics';

import TasksModel from './models/tasks';


import {generateTasks} from './mock/task';
import {RenderPosition, render} from './utils/render';

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const siteMenuComponent = new SiteMenuComponent();
render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

tasksModel.setDataChangeHandler(() => {
  filterController.render();
});

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);

render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render();

const statisticsComponent = new StatisticsComponent(tasksModel);
statisticsComponent.hide();
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;

    case MenuItem.STATISTICS:
      siteMenuComponent.setActiveItem(MenuItem.STATISTICS);

      statisticsComponent.show();
      boardComponent.hide();
      break;

    case MenuItem.TASKS:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);

      boardComponent.show();
      statisticsComponent.hide();
      break;
  }
});
