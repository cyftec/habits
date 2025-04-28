import { Habit, StoreHabitID } from "../types";
import { getDaysDifference, getUrlParams } from "../utils";

export const fetchHabits = () => {
  const updatedHabits: Habit[] = [];
  for (let key in localStorage) {
    if (!key.startsWith("h.")) continue;
    const habit: Habit | string = JSON.parse(localStorage.getItem(key) || "");
    if (typeof habit !== "object") continue;
    updatedHabits.push(habit as Habit);
  }

  return updatedHabits;
};

export const fetchHabit = (habitID: string) => {
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

export const saveHabitInStore = (habitID: StoreHabitID, habit: Habit) => {
  console.log(habit);
  localStorage.setItem(habitID, JSON.stringify(habit));
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
    const habitID: StoreHabitID = `h.${id}`;
    try {
      habit = fetchHabit(habitID);
    } catch (errMsg) {
      error = errMsg.toString();
    }
  }

  return [habit, error];
};
