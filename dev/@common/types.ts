export type DayFrequency = [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1];

export type Habit = {
  title: string;
  frequency: DayFrequency;
  startAtDay0: 0 | 1;
  colorIndex: number;
  levels: string[];
  tracker: number[];
};
