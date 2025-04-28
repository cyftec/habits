import { Habit } from "../types";
import { getUrlParams } from "../utils";

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

export const updateHabitInStore = (habitID: `h.${number}`, habit: Habit) => {
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
    const habitID = `h.${param.split("id=").pop()}`;
    try {
      habit = fetchHabit(habitID);
    } catch (errMsg) {
      error = errMsg.toString();
    }
  }

  return [habit, error];
};
