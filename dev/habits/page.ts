import { derive, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  HOMEPAGE_OVERVIEW_TABS,
  HOMEPAGE_SORT_OPTIONS,
} from "../@common/constants";
import {
  fetchHabits,
  intializeTrackerEmptyDays,
  localSettings,
} from "../@common/localstorage";
import { Habit } from "../@common/types";
import { getCompletionPercentage, goToHabitPage } from "../@common/utils";
import {
  AddHabitButton,
  HabitCard,
  NavScaffold,
  SortOptions,
} from "../@components";
import { Page, TabBar } from "../@elements";

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
const sortedActiveHabits = derive(() =>
  sortedHabits.value.filter((hab) => !hab.isStopped)
);
const sortedStoppedHabits = derive(() =>
  sortedHabits.value.filter((hab) => hab.isStopped)
);

const onPageMount = () => {
  intializeTrackerEmptyDays();
  habits.value = fetchHabits();
};

export default Page({
  classNames: "bg-white",
  onMount: onPageMount,
  body: NavScaffold({
    classNames: "ph3 bg-white",
    route: "/habits/",
    header: m.Div({
      class: "flex items-start justify-between bg-white",
      children: [
        "Habits",
        SortOptions({
          classNames: "mt2 mr2",
          iconSize: 22,
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
          classNames: "nl1 b f7 w-75",
          selectedTabClassNames: "pv3 br4",
          tabs: HOMEPAGE_OVERVIEW_TABS.map((ov) => ov.label),
          selectedTabIndex: selectedTabIndex,
          onTabChange: (tabIndex) => {
            const settings = localSettings.value;
            localSettings.value = {
              ...settings,
              habitsPage: { ...settings.habitsPage, tabIndex },
            };
            // location.reload();
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
          children: m.For({
            subject: sortedActiveHabits,
            itemKey: "id",
            map: (activeHabit) =>
              HabitCard({
                classNames: "mt4",
                habit: activeHabit,
                months: totalOverviewMonths,
                onClick: () => goToHabitPage(activeHabit.value.id),
              }),
          }),
        }),
        m.If({
          subject: derive(() => sortedStoppedHabits.value.length),
          isTruthy: m.Div(
            m.For({
              subject: sortedStoppedHabits,
              itemKey: "id",
              n: 0,
              nthChild: m.Div({
                class: "silver f6 mt5 mb3",
                children: "OLD HABITS (DIE HARD, LOL)",
              }),
              map: (stoppedHabit) =>
                HabitCard({
                  classNames: "mb3",
                  habit: stoppedHabit,
                  months: totalOverviewMonths,
                  onClick: () => goToHabitPage(stoppedHabit.value.id),
                }),
            })
          ),
        }),
      ],
    }),
    navbarTop: AddHabitButton({}),
  }),
});
