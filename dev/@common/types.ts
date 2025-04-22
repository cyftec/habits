import { DAYS_OF_WEEK, MONTHS } from "./constants";

export type DayFrequency = [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1];

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export type Month = (typeof MONTHS)[number];

export type MonthStatus = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export type HabitPause = {
  start: number;
  end: number;
};
export type Habit = {
  id: number;
  title: string;
  frequency: DayFrequency;
  startAtDay0: 0 | 1;
  colorIndex: number;
  levels: string[];
  tracker: number[];
  pauses: HabitPause[];
  isStopped: boolean;
  newerVersion?: number;
  olderVersion?: number;
};
