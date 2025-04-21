import { dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { Habit } from "../@common/types";
import { Button, Page, Scaffold } from "../@elements";

const habits = signal<Habit[]>([]);

export default Page({
  onMount: () => {
    const updatedHabits = [...habits.value];
    for (let key in localStorage) {
      if (!key.startsWith("h.")) continue;
      const habit: Habit | string = JSON.parse(localStorage.getItem(key) || "");
      if (typeof habit !== "object") continue;
      updatedHabits.push(habit as Habit);
    }
    habits.value = updatedHabits;
  },
  body: Scaffold({
    classNames: "bg-white ph3",
    header: "Wake up @5am",
    content: m.Div({
      children: "habit details page",
    }),
    bottombar: Button({
      label: dstring`go back to home page`,
      onTap: () => (location.href = "/"),
    }),
  }),
});
