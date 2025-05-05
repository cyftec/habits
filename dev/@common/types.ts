export type LocalSettings = {
  id: "local-settings";
  habitsPage: {
    tabIndex: number;
    sortOptionIndex: number;
  };
  editPage: {
    showHints: boolean;
    showFullCustomisation: boolean;
  };
};

export type Analytics = {
  id: "analytics";
  lastInteraction: number;
};

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
export type WeekdayFrequency = [
  0 | 1,
  0 | 1,
  0 | 1,
  0 | 1,
  0 | 1,
  0 | 1,
  0 | 1
];
export type MilestonesData = [number, number, number];
export type MilestoneUI = {
  label: string;
  percent: number;
  icon: string;
  color: string;
};
export type StoreHabitRecordKey = `h.${number}`;
export type Habit = {
  id: number;
  title: string;
  frequency: WeekdayFrequency;
  colorIndex: number;
  levels: string[];
  tracker: number[];
  milestones: MilestonesData;
  pauses: HabitPause[];
  isStopped: boolean;
};

export type LevelUI = {
  name: string;
  code: number;
};

export type DailyStatus = {
  level: LevelUI;
  date: Date;
};

export type HabitUI = {
  id: number;
  startDate: Date;
  title: string;
  frequency: WeekdayFrequency;
  colorIndex: number;
  levels: LevelUI[];
  tracker: DailyStatus[];
  milestones: MilestonesData;
  pauses: HabitPause[];
  isStopped: boolean;
};
