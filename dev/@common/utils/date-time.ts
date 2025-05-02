import { DAY_IN_MS, EMPTY_MONTH } from "../constants";
import { Habit, MonthStatus } from "../types";

export const getMomentZeroDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getMomentZero = (date: Date): number =>
  getMomentZeroDate(date).getTime();

export const getDaysDifference = (earlierDate: Date, laterDate: Date) => {
  const earlierDateMZ = getMomentZeroDate(earlierDate);
  const laterDateMZ = getMomentZeroDate(laterDate);
  return Math.round(
    (laterDateMZ.getTime() - earlierDateMZ.getTime()) / DAY_IN_MS
  );
};

export const getLastNDays = (date: Date, n: number) => {
  if (n < 1) throw `N should be some positive integer`;
  const time = date.getTime();
  return Array(n)
    .fill(0)
    .map((_, i) => new Date(time - (n - 1 - i) * DAY_IN_MS));
};

export const getLastSevenDays = (date: Date) => getLastNDays(date, 7);

export const getLastTwoWeeks = (date: Date) => {
  const time = date.getTime();
  const gapFromSaturday = 6 - (date.getDay() % 7);
  const saturday = new Date(time + gapFromSaturday * DAY_IN_MS);
  return getLastNDays(saturday, 14);
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

  return monthsFirstDateList.map((monthFirstDayDate) => ({
    monthIndex: monthFirstDayDate.getMonth(),
    status: getMonthStatus(habit, monthFirstDayDate),
  }));
};
