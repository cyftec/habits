import { Habit } from "./types";

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
