import { effect, signal } from "@cyftech/signal";
import {
  areSameDates,
  getDaysGap,
  getHabitData,
  getHabitUI,
} from "../transforms";
import { Habit, HabitUI } from "../types";
import {
  fetchHabitsFromStore,
  fetchHabitWithKey,
  getHabitStoreRecordKey,
  hardDeleteHabitFromStore,
  saveHabitInStore,
} from "./habits";
import { fetchSettings, updateSettings } from "./settings";
import { phase } from "@mufw/maya/utils";
import { fetchAnalytics, updateAnalytics } from "./analytics";
import { INITIAL_ANALYTICS } from "../constants";

/**
 *
 *
 *
 *    ANALYTICS
 */

export const getLastInteraction = () => {
  if (!phase.currentIs("run")) {
    console.log(`current phase is not run`);
    return INITIAL_ANALYTICS.lastInteraction;
  }
  const currentAnalytics = fetchAnalytics();
  return currentAnalytics.lastInteraction;
};

export const updateInteractionTime = (date: Date) => {
  const currentAnalytics = fetchAnalytics();
  updateAnalytics({
    ...currentAnalytics,
    lastInteraction: date.getTime(),
  });
};

/**
 *
 *
 *
 *    HABITS
 */

export const fetchHabit = (habitId: number): HabitUI => {
  const habitID = getHabitStoreRecordKey(habitId);
  const habit = fetchHabitWithKey(habitID);

  if (!habit) throw `Error fetching habit with id '${habitId}' from storage`;
  return getHabitUI(habit);
};

export const fetchHabits = (): HabitUI[] => {
  const habits: Habit[] = fetchHabitsFromStore();
  return habits.map((habit) => getHabitUI(habit));
};

export const findHabit = (habitTitle: string): HabitUI | undefined => {
  const habits: Habit[] = fetchHabitsFromStore();
  const foundHabit = habits.find(
    (habit) => habit.title.trim() === habitTitle.trim()
  );

  return foundHabit ? getHabitUI(foundHabit) : undefined;
};

export const intializeTrackerEmptyDays = () => {
  console.log(`initialization called`);
  const habits = fetchHabitsFromStore();
  for (let habit of habits) {
    const day1 = new Date(habit.id);
    const today = new Date();
    const daysGap = getDaysGap(day1, today);
    const updatedTracker = [...habit.tracker];
    if (daysGap + 2 <= updatedTracker.length) continue;

    /**
     * A scenario where today's weekday was not added in
     * the schedule earlier but is changed now. Since today
     * is not in the habit scheduled weekday, it should be eligible
     * to get initialized.
     *
     * Earlier when a day set as -1 or lower, the day was simply
     * not modifiable.
     */
    const lastStatusIndex = updatedTracker.length - 1;
    const lastStatusDay = new Date(
      day1.getFullYear(),
      day1.getMonth(),
      day1.getDate() + lastStatusIndex
    );
    const lastStatusDayOfWeek = lastStatusDay.getDay();
    if (areSameDates(today, lastStatusDay)) {
      const lastStatus = updatedTracker[lastStatusIndex];
      updatedTracker[lastStatusIndex] = habit.frequency[lastStatusDayOfWeek]
        ? lastStatus < 0
          ? 0
          : lastStatus
        : -1;
    }

    for (let i = updatedTracker.length; i <= daysGap; i++) {
      const day = new Date(
        day1.getFullYear(),
        day1.getMonth(),
        day1.getDate() + i
      );
      const dayOfWeek = day.getDay();
      updatedTracker[i] = habit.frequency[dayOfWeek] ? 0 : -1;
    }
    habit.tracker = updatedTracker;
    saveHabitInStore(habit);
  }
};

export const saveHabit = (habit: HabitUI) => {
  const habitData: Habit = getHabitData(habit);
  saveHabitInStore(habitData);
};
export const stopHabit = (habitId: number) => {
  const habit = fetchHabit(habitId);
  const habitData = getHabitData(habit);
  const updatedHabit: Habit = { ...habitData, isStopped: true };
  saveHabitInStore(updatedHabit);
};
export const deleteHabit = (habitId: number) =>
  hardDeleteHabitFromStore(habitId);

/**
 *
 *
 *
 *    SETTINGS
 */

export const localSettings = signal(fetchSettings());

effect(() => {
  const currentSetting = localSettings.value;
  if (!phase.currentIs("run")) return;
  updateSettings(currentSetting);
});
