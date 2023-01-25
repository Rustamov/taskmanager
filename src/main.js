import API from './api';
import Provider from './api/provider';
import Store from './api/store';
import BoardComponent from './components/board';
import BoardController from './controllers/board';
import FilterController from './controllers/filter';
import SiteMenuComponent, {MenuItem} from './components/site-menu';
import StatisticsComponent from './components/statistics';
import TasksModel from './models/tasks';
// import {generateTasks} from './mock/task';
import {RenderPosition, render} from './utils/render';

const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const api = new API(`https://18.ecmascript.pages.academy/task-manager`, `Basic ghdhJLJLNJMgDSDadsad`);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const tasksModel = new TasksModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel, apiWithProvider);
const filterController = new FilterController(boardComponent, tasksModel);

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);


siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      boardController.show();
      statisticsComponent.hide();

      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;

    case MenuItem.STATISTICS:
      siteMenuComponent.setActiveItem(MenuItem.STATISTICS);

      statisticsComponent.show();
      boardController.hide();
      break;

    case MenuItem.TASKS:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);

      boardController.show();
      statisticsComponent.hide();
      break;
  }
});

tasksModel.setDataChangeHandler(() => {
  filterController.render();
});
tasksModel.setFilterChangeHandler(() => {
  if (siteMenuComponent.getActiveItem() !== MenuItem.TASKS) {
    siteMenuComponent.setActiveItem(MenuItem.TASKS);

    boardComponent.show();
    statisticsComponent.hide();
  }
});


apiWithProvider.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    console.log(tasksModel.getTasksAll());
    filterController.render();
    boardController.render();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register('/sw.js')
    .then((reg) => {
      // Регистрация сработала
      // console.log('Registration succeeded. Scope is ' + reg.scope);
    })
    .catch((error) => {
      // Регистрация прошла неудачно
      // console.log('Registration failed with ' + error);
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

