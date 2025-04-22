import { DAY_IN_MS, EMPTY_MONTH } from "./constants";
import { MonthStatus } from "./types";

export const getNewHabitId = () => new Date().getTime();

export const getUrlParams = () => {
  if (!location) return [];
  return location.href.split("?")[1].split("&");
};

export const getMomentZeroDate = (msFromEpoch: number) => {
  const date = new Date(msFromEpoch);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getMonthStatus = (
  habitCreationTime: number,
  statusTrack: number[],
  year: number,
  monthIndex: number
) => {
  const monthStatus: MonthStatus = [...EMPTY_MONTH];
  const habitCreationDate = new Date(habitCreationTime);
  const y = habitCreationDate.getFullYear();
  const m = habitCreationDate.getMonth();
  const d = habitCreationDate.getDate();
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
