import { derive, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  HOMEPAGE_OVERVIEW_TABS,
  HOMEPAGE_SORT_OPTIONS,
} from "./@common/constants";
import { fetchHabits, localSettings } from "./@common/localstorage";
import { Habit } from "./@common/types";
import { getCompletionPercentage } from "./@common/utils";
import { SortOptions } from "./@components";
import { HabitCard } from "./@components/HabitCard";
import { Button, Page, Scaffold, TabBar } from "./@elements";

const selectedSortOptionIndex = derive(
  () => localSettings.value.habitsPage.sortOptionIndex
);
const selectedTabIndex = derive(() => localSettings.value.habitsPage.tabIndex);
const totalOverviewMonths = derive(
  () => HOMEPAGE_OVERVIEW_TABS[selectedTabIndex.value].months
);

const habits = signal<Habit[]>([]);
const sortedHabits = derive(() => {
  const selectedOption = HOMEPAGE_SORT_OPTIONS[selectedSortOptionIndex.value];
  const totalMonths = totalOverviewMonths.value;
  const optionLabel = selectedOption.label;
  const sortedHabitsWithCompletion = habits.value.map((habit) => ({
    ...habit,
    completion: getCompletionPercentage(habit, totalMonths),
  }));
  sortedHabitsWithCompletion.sort((a, b) => {
    if (optionLabel === "Completion (Highest first)")
      return b.completion - a.completion;
    if (optionLabel === "Completion (Lowest first)")
      return a.completion - b.completion;
    if (optionLabel === "Date created (Oldest first)") return a.id - b.id;

    return b.id - a.id;
  });

  return sortedHabitsWithCompletion;
});

export default Page({
  classNames: "bg-near-white",
  onMount: () => (habits.value = fetchHabits()),
  body: Scaffold({
    classNames: "bg-near-white ph3",
    header: m.Div({
      class: "flex items-start justify-between",
      children: [
        "Daily habits",
        SortOptions({
          classNames: "mt2 mr2",
          selectedOptionIndex: selectedSortOptionIndex,
          onChange: (optionIndex) => {
            const settings = localSettings.value;
            localSettings.value = {
              ...settings,
              habitsPage: {
                ...settings.habitsPage,
                sortOptionIndex: optionIndex,
              },
            };
          },
        }),
      ],
    }),
    content: m.Div({
      children: [
        TabBar({
          classNames: "nl1 b f7 pb2 mb3",
          selectedTabClassNames: "pv3 br4",
          tabs: HOMEPAGE_OVERVIEW_TABS.map((ov) => ov.label),
          selectedTabIndex: selectedTabIndex,
          onTabChange: (tabIndex) => {
            const settings = localSettings.value;
            localSettings.value = {
              ...settings,
              habitsPage: { ...settings.habitsPage, tabIndex },
            };
          },
        }),
        m.If({
          subject: derive(() => sortedHabits.value.length),
          isFalsy: m.Div({
            class: "flex justify-around",
            children: m.Div({
              class: "mt6 pt5",
              children: "No habits added",
            }),
          }),
        }),
        m.Div({
          class: "pb7 mb6",
          children: m.For({
            subject: sortedHabits,
            itemKey: "id",
            map: (habit) =>
              HabitCard({
                classNames: "mb3",
                habit: habit,
                months: totalOverviewMonths,
              }),
          }),
        }),
      ],
    }),
    bottombar: m.Div({
      class: "w-100 flex justify-around",
      children: Button({
        className: "pv3 ph4 mb4 shadow-4 b",
        label: dstring`Add new habit`,
        onTap: () => (location.href = "/edit/"),
      }),
    }),
  }),
});
