import { phase } from "@mufw/maya/utils";
import { Habit, StoreHabitID } from "../types";
import { getDaysDifference, getHabitUI, getUrlParams } from "../utils";

export const fetchHabits = () => {
  if (!phase.currentIs("run")) return [];

  const habits: Habit[] = [];
  for (let key in localStorage) {
    if (!key.startsWith("h.")) continue;
    const habit: Habit | string = JSON.parse(localStorage.getItem(key) || "");
    if (typeof habit !== "object") continue;
    habits.push(habit as Habit);
  }

  return habits;
};

export const getHabitsForDate = (date: Date) =>
  fetchHabits()
    .filter((hab) => {
      return !hab.isStopped && hab.frequency[date.getDay()];
    })
    .map((hab) => getHabitUI(hab));

export const fetchHabit = (habitId: number) => {
  const habitID: StoreHabitID = `h.${habitId}`;
  const habitJSON = localStorage.getItem(habitID);
  const habitObj = JSON.parse(habitJSON || "");

  if (!habitObj) throw `Error fetching habit with id '${habitID}' from storage`;
  return habitObj as Habit;
};

export const intializeTrackerEmptyDays = () => {
  for (let key in localStorage) {
    if (!key.startsWith("h.")) continue;
    const habit: Habit | string = JSON.parse(localStorage.getItem(key) || "{}");
    if (typeof habit !== "object" || !habit["title"]) continue;
    const habitID: StoreHabitID = `h.${habit.id}`;
    const day1 = new Date(habit.id);
    const today = new Date();
    const daysGap = getDaysDifference(day1, today);
    const updatedTracker = [...habit.tracker];
    if (daysGap + 1 <= updatedTracker.length) continue;

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
    localStorage.setItem(habitID, JSON.stringify(habit));
  }
};

export const saveHabitInStore = (habit: Habit) => {
  const habitID: StoreHabitID = `h.${habit.id}`;
  localStorage.setItem(habitID, JSON.stringify(habit));
};

export const deleteHabitFromStore = (habitId: number) => {
  const habitID: StoreHabitID = `h.${habitId}`;
  localStorage.removeItem(habitID);
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
    const idString = param.split("id=").pop();
    const id = +(idString || "__");
    if (!id || isNaN(id)) continue;
    try {
      habit = fetchHabit(id);
    } catch (errMsg) {
      error = errMsg.toString();
    }
  }

  return [habit, error];
};
