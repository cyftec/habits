import { BASE_LEVELS, DAY_IN_MS, EMPTY_MONTH } from "./constants";
import { fetchHabit } from "./localstorage";
import { Habit, MonthStatus } from "./types";

export const getNewHabit = (backDays?: number): Habit => {
  const now = new Date().getTime();
  return {
    id: backDays ? now - DAY_IN_MS * backDays : now,
    title: "",
    frequency: [1, 1, 1, 1, 1, 1, 1],
    startAtDay0: 1,
    colorIndex: 0,
    levels: BASE_LEVELS,
    tracker: [],
    pauses: [],
    isStopped: false,
  };
};
export const getHabitValidationError = (habit: Habit): string => {
  if (!habit.title) {
    return "Title should not be empty";
  }
  if (habit.frequency.every((day) => !day)) {
    return "Select at least one day in a week";
  }
  if (!habit.levels.every((level) => !!level)) {
    return "One of the levels is empty";
  }

  return "";
};
export const tryFetchingHabitUsingParams = (): readonly [
  Habit | undefined,
  string
] => {
  const params = getUrlParams();
  if (!params.length) [undefined, "No query params found"];
  let habit: Habit | undefined;
  let error: string = "";

  for (let param of params) {
    if (!param.startsWith("id=")) continue;
    const habitID = `h.${param.split("id=").pop()}`;
    try {
      habit = fetchHabit(habitID);
    } catch (errMsg) {
      error = errMsg.toString();
    }
  }

  return [habit, error];
};

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
