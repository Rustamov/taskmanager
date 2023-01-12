import AbstractComponent from "./abstract-component";
import {isOneDay} from "../utils/common";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import flatpickr from "flatpickr";
import { COLOR } from "../const";

import "flatpickr/dist/flatpickr.min.css";


const createStatisticsTemplate = (task) => {
  // const {description: notSanitaizedDescription, dueDate, color, repeatingDays, id} = task;


  return (
    `<section class="statistic container">
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

          <div class="statistic-input-wrap">
            <input
              class="statistic__period-input"
              type="text"
              placeholder="01 Feb - 08 Feb"
            />
          </div>

          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">0</span> tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>

      <div class="statistic__circle">
        <div class="statistic__colors-wrap">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractComponent {
  constructor(tasksModel) {
    super();
    this._tasksModel = tasksModel;
    this._filteredTasks = null;
    this._lineGraphic = null;
    this._pieGraphic = null;

    this._flatpickr = null;

    this._applyFlatpickr();

    this._subscribeOnEvents();
  }


  getTemplate() {
    return createStatisticsTemplate(this._task);
  }

  buildLineGraphic() {
    if (this._lineGraphic) {
      this._lineGraphic.destroy();
    }

    const canvas = this.getElement().querySelector(`.statistic__days`);
    const tasks = this._getFilteredTasks();

    tasks
      .sort((a, b) => a.dueDate - b.dueDate);

    const dataObj = {};
    tasks.forEach((task) => {
      const day = moment(task.dueDate).format(`DD MMM`);

      if (day in dataObj) {
        dataObj[day] += task.isArchive ? 1 : 0;
      } else {
        dataObj[day] = task.isArchive ? 1 : 0;
      }
    });

    const dataLabels = Object.keys(dataObj).sort();
    const dataSet = Object.values(dataObj);

    this._lineGraphic = new Chart(canvas, {
      type: `line`,
      data: {
        labels: dataLabels,
        datasets: [{
          label: `# of Votes`,
          data: dataSet,

          fill: `true`,
          borderWidth: 1,
          borderColor: `#000`,
          backgroundColor: `#000`,
          color: `#fff`,

          pointRadius: 10,
          pointHoverRadius: 12
        }]
      },
      plugins: [ChartDataLabels],
      options: {
        scales: {
          x: {
            // display: false,
            grid: {
              display: false,
            },
            ticks: {
            },
          },
          y: {
            display: false,
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {// This code is used to display data values
            font: {
              weight: `normal`,
              size: 10,
            },
            color: `#ffffff`,
          }
        }
      },
    });
  }

  buildPieGraphic() {
    if (this._pieGraphic) {
      this._pieGraphic.destroy()
    }

    const canvas = this.getElement().querySelector(`.statistic__colors`);
    const tasks = this._getFilteredTasks();


    const dataObj = {};
    tasks.forEach((task) => {
      const color = task.color;

      if (color in dataObj) {
        dataObj[color] += task.isArchive ? 1 : 0;
      } else if (task.isArchive) {
        dataObj[color] = 1;
      }
    });

    const dataLabels = Object.keys(dataObj).sort();
    const dataSet = Object.values(dataObj);

    this._pieGraphic = new Chart(canvas, {
      type: `pie`,
      data: {
        labels: dataLabels,
        datasets: [{
          label: `# of Votes`,
          data: dataSet,

          borderWidth: 1,
          borderColor: `#fff`,
          backgroundColor: dataLabels,
          color: `#fff`,
        }]
      },
      options: {
        scales: {
          x: {
            display: false,
            grid: {
              display: false,
            },
          },
          y: {
            display: false,
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            position: 'left',
          },
          tooltip: false,
        }
      },
    });
  }

  show() {
    super.show();

    this._drawGraphics();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateElement = this.getElement().querySelector(`.statistic__period-input`);

    const todayDate = new Date();

    this._flatpickr = flatpickr(dateElement, {
      mode: `range`,
      altInput: true,
      allowInput: true,
      defaultDate: [todayDate.setDate(todayDate.getDate() - 7), todayDate.setDate(todayDate.getDate() + 7)],
    });

  }

  _getFilteredTasks() {
    if (this._filteredTasks !== null) {
      return this._filteredTasks;
    }

    const dateValue = this.getElement().querySelector(`.statistic__period-input`).value;
    const dateFrom = new Date(dateValue.split(` to `)[0]);
    const dateTo = new Date(dateValue.split(` to `)[1]);

    const tasks = this._tasksModel.getTasksAll().filter((task) => {
      if (task.dueDate === null) {
        return false;
      }

      if (dateFrom > task.dueDate || task.dueDate > dateTo) {
        return false;
      }

      return true;
    });

    this._filteredTasks = tasks;
    return tasks;
  }

  _drawGraphics() {

    this.buildLineGraphic();
    this.buildPieGraphic();
  }

  _upadteGraphics() {
    this._filteredTasks = null;

    this._drawGraphics();
  }


  _subscribeOnEvents() {
    this.getElement().querySelector(`.statistic__period-input`)
      .addEventListener(`change`, () => {
        this._upadteGraphics();
      });

  }

  // setEditButtonClickHandler(handler) {
  //   this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, handler);
  // }

  // setFavoritesButtonClickHandler(handler) {
  //   this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, handler);
  // }

  // setArchiveButtonClickHandler(handler) {
  //   this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, handler);
  // }
}
