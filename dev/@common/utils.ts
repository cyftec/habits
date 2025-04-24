import { EMPTY_MONTH } from "./constants";
import { Habit, MonthStatus } from "./types";

export const getNewHabitId = () => new Date().getTime();

export const getUrlParams = () => {
  if (!location) return [];
  return location.href.split("?")[1].split("&");
};

export const getMomentZeroDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getMonthStatus = (habit: Habit, date: Date) => {
  const habitCreationTime = habit.id;
  const statusTrack = habit.tracker;
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const monthStatus: MonthStatus = [...EMPTY_MONTH];
  const firstStatusDate = new Date(habitCreationTime);
  const y = firstStatusDate.getFullYear();
  const m = firstStatusDate.getMonth();
  const d = firstStatusDate.getDate();
  for (let i = 0; i < statusTrack.length; i++) {
    const date = new Date(y, m, d + i);
    const dateY = date.getFullYear();
    const dateM = date.getMonth();
    if (dateY > year) break;
    if (dateY === year && dateM > monthIndex) break;

    if (dateY === year && dateM === monthIndex) {
      const dateD = date.getDate();
      monthStatus[dateD - 1] = statusTrack[i];
    }
  }
  return monthStatus;
};

export const getMonthsStatus = (habit: Habit, months: number) => {
  const today = new Date();
  const monthsFirstDateList = Array(months)
    .fill(0)
    .map((x, i) => new Date(today.getFullYear(), today.getMonth() - i, 1))
    .reverse();

  return monthsFirstDateList.map((monthFirstDay) => ({
    monthIndex: monthFirstDay.getMonth(),
    status: getMonthStatus(habit, monthFirstDay),
  }));
};

export const getCompletionPercentage = (habit: Habit, months: number) => {
  const monthsStatus = getMonthsStatus(habit, months);
  const levels = habit.levels.length - 1;
  let completion = 0;
  let count = 0;

  for (const month of monthsStatus) {
    for (const dayStatus of month.status) {
      if (dayStatus > -1) {
        count++;
        completion += dayStatus;
      }
    }
  }
  return Math.ceil((completion / (count * levels)) * 100);
};
