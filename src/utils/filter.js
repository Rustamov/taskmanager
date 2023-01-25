import {isRepeating, isOneDay, isOverdueDate} from "./common";
import {FilterType} from "../const";

export const getTasksByFilter = (tasks, filterType) => {
  let filteredTasks = tasks.slice();

  switch (filterType) {
    case FilterType.ALL:
      filteredTasks = filteredTasks.filter((task) => !task.isArchive);
      break;

    case FilterType.OVERDUE:
      filteredTasks = filteredTasks.filter((task) => {
        const isExpired = task.dueDate instanceof Date && isOverdueDate(task.dueDate, new Date());

        return isExpired;
      });
      break;

    case FilterType.TODAY:
      filteredTasks = filteredTasks.filter((task) => {
        const isToday = task.dueDate instanceof Date && isOneDay(task.dueDate, new Date());

        return isToday;
      });
      break;

    case FilterType.FAVORITES:
      filteredTasks = filteredTasks.filter((task) => task.isFavorite);
      break;

    case FilterType.REPEATING:
      filteredTasks = filteredTasks.filter((task) => {
        const isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);

        return isRepeatingTask;
      });
      break;

    case FilterType.ARCHIVE:
      filteredTasks = filteredTasks.filter((task) => task.isArchive);
      break;
  }

  return filteredTasks;
};

export const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

export const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

