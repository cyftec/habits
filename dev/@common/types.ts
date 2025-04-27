import { DAYS_OF_WEEK, MONTHS } from "./constants";

export type LocalSettings = {
  id: "local-settings";
  habitsPage: {
    tabIndex: number;
    sortOptionIndex: number;
  };
};

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
export type MilestonesData = [number, number, number];
export type MilestoneUI = {
  label: string;
  percent: number;
  icon: string;
  color: string;
};
export type Habit = {
  id: number;
  title: string;
  frequency: DayFrequency;
  colorIndex: number;
  levels: string[];
  tracker: number[];
  milestones: MilestonesData;
  pauses: HabitPause[];
  isStopped: boolean;
};
