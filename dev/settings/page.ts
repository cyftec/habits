import { derive, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { AddHabitButton, NavScaffold } from "../@components";
import { Page, ProgressBar } from "../@elements";

export default Page({
  classNames: "bg-white",
  // onMount: transitionToHabitsPage,
  body: NavScaffold({
    classNames: "ph3",
    route: "/settings/",
    header: "Settings Page",
    content: m.Div({
      children: [m.Div({ class: "pv6" }), "Normal Page"],
    }),
    // navbarTop: AddHabitButton({}),
  }),
});
