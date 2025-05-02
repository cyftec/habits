import {
  BASE_COLORS,
  BASE_LEVELS,
  BASE_MILESTONES,
  BASE_WEEKDAY_FREQUENCY,
  DAY_IN_MS,
  GOLDEN_RATIO,
} from "../constants";
import { fetchHabit, saveHabitInStore } from "../localstorage";
import {
  DailyStatus,
  Habit,
  HabitUI,
  LevelUI,
  MilestonesData,
  MilestoneUI,
  StoreHabitID,
} from "../types";
import {
  getDaysDifference,
  getMomentZero,
  getMomentZeroDate,
  getMonthsStatus,
} from "./date-time";

export const getLevelUI = (level: number, levels: string[]): LevelUI => ({
  name: levels[level],
  code: level,
});

export const getDailyStatus = (
  level: number,
  levels: string[],
  date: Date
): DailyStatus => ({
  level: getLevelUI(level, levels),
  date: date,
});

export const getDayStatus = (tracker: DailyStatus[], date: Date) =>
  tracker.find((status) => getMomentZero(status.date) === getMomentZero(date));

export const getHabitUI = (habit: Habit): HabitUI => {
  const startDate = getMomentZeroDate(new Date(habit.id));
  return {
    ...habit,
    startDate,
    levels: habit.levels.map((levelName, index) => ({
      name: levelName,
      code: index,
    })),
    tracker: habit.tracker.map((status, i) =>
      getDailyStatus(
        status,
        habit.levels,
        new Date(startDate.getTime() + i * DAY_IN_MS)
      )
    ),
  };
};

export const getNewHabit = (backDays?: number): Habit => {
  const now = new Date().getTime();
  return {
    id: backDays ? now - DAY_IN_MS * backDays : now,
    title: "",
    frequency: BASE_WEEKDAY_FREQUENCY,
    colorIndex: 0,
    levels: BASE_LEVELS,
    tracker: [],
    milestones: BASE_MILESTONES,
    pauses: [],
    isStopped: false,
  };
};

export const getDetailedMilestones = (
  milestones: MilestonesData
): MilestoneUI[] => [
  {
    label: "Successful",
    percent: milestones[0],
    icon: "verified_user",
    color: "green",
  },
  {
    label: "Little more to go",
    percent: milestones[1],
    icon: "done_all",
    color: "light-blue",
  },
  {
    label: "Going good",
    percent: milestones[2],
    icon: "check",
    color: "blue",
  },
  { label: "Unacceptable", percent: 0, icon: "close", color: "red" },
];

export const getMilestone = (
  milestones: MilestonesData,
  completionPercentage: number
): MilestoneUI => {
  const dms = getDetailedMilestones(milestones);
  let milestone: MilestoneUI = dms[0];
  for (let i = 0; i < dms.length; i++) {
    milestone = dms[i];
    if (milestone.percent < completionPercentage) break;
  }
  return milestone;
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
  if (!habit.milestones.every((m) => m <= 100 && m >= 0)) {
    return `The milestones should be between 0 and 100 percents`;
  }
  if (!habit.milestones.every((m, i, ms) => (i === 0 ? true : ms[i - 1] > m))) {
    return `Milestones should be in order (from high to low)`;
  }

  return "";
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

export const getColorsForLevel = (
  level: number,
  totalLevels: number,
  colorIndex: number,
  showText = false
) => {
  const color = BASE_COLORS[colorIndex];

  const opacityHexNum = Math.trunc(
    Math.pow(level / (totalLevels - 1), GOLDEN_RATIO) * 255
  );
  const hex = opacityHexNum.toString(16);
  const opacityHex = hex.length === 1 ? `0${hex}` : hex;
  const backgroundColor =
    level < 0 || opacityHex === "0" ? "transparent" : `${color}${opacityHex}`;
  const fontColor = showText
    ? level / (totalLevels - 1) > 0.5
      ? "white"
      : "black"
    : level < 0
    ? "lightgray"
    : "transparent";

  return { backgroundColor, fontColor };
};

export const updateHabitStatus = (
  habit: HabitUI,
  levelCode: number,
  date: Date
) => {
  const habitData: Habit = fetchHabit(habit.id);
  const updatedTracker = [...habitData.tracker];
  const index = getDaysDifference(new Date(habitData.id), date);
  updatedTracker[index] = levelCode;
  const updatedHabitData = { ...habitData, tracker: updatedTracker };
  saveHabitInStore(updatedHabitData);
};
