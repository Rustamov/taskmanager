import TaskEditComponent from '../components/task-edit';
import TaskComponent from '../components/task';
import TaskModel from '../models/task';
import {RenderPosition, render, replace, remove} from '../utils/render';
import {COLOR, DAYS} from '../const';

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLOR.BLACK,
  isArchive: false,
  isFavorite: false,
};

const parseFormData = (formData) => {
  const date = formData.get(`date`);
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  return new TaskModel({
    "description": formData.get(`text`),
    "due_date": date ? new Date(date) : null,
    "repeating_days": formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    "color": formData.get(`color`),
    "is_favorite": false,
    "is_archive": false,
  });
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      console.log(newTask);
      newTask.isArchive = !newTask.isArchive;


      this._onDataChange(this, task, newTask);
      // this._onDataChange(this, task, Object.assign({}, task, {
      //   isArchive: !task.isArchive
      // }));
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isFavorite = !newTask.isFavorite;

      this._onDataChange(this, task, newTask);
      // this._onDataChange(this, task, Object.assign({}, task, {
      //   isFavorite: !task.isFavorite
      // }));
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._taskEditComponent.getData();
      const data = parseFormData(formData);

      this._taskEditComponent.setData({
        saveButtonText: `Saving...`,
      });

      this._onDataChange(this, task, data);
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => {
      this._taskEditComponent.setData({
        deleteButtonText: `Deleting...`,
      });

      this._onDataChange(this, task, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskComponent && oldTaskEditComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent, RenderPosition.AFTERGBEGIN);
        }
        break;

      case Mode.ADDING:
        if (oldTaskComponent && oldTaskEditComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          document.addEventListener(`keydown`, this._onEscKeyDown);
          render(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        }

        break;
    }

    // if (oldTaskComponent && oldTaskEditComponent) {
    //   replace(this._taskComponent, oldTaskComponent);
    //   replace(this._taskEditComponent, oldTaskEditComponent);
    //   this._replaceEditToTask();
    // } else if (this._mode === Mode.EDIT || this._mode === Mode.ADDING) {
    //   render(this._container, this._taskEditComponent, RenderPosition.AFTERGBEGIN);
    // } else {
    //   render(this._container, this._taskComponent, RenderPosition.AFTERGBEGIN);
    // }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._taskComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskComponent.getElement().style.animation = ``;
      this._taskEditComponent.getElement().style.animation = ``;

      this._taskEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditComponent, this._taskComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();

    if (document.body.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {

    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}
