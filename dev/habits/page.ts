import { derive, dobject, effect, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  HOMEPAGE_OVERVIEW_TABS,
  HOMEPAGE_SORT_OPTIONS,
  INITIAL_SETTINGS,
} from "../@common/constants";
import {
  fetchHabits,
  getHabitsPageSettings,
  intializeTrackerEmptyDays,
  updateHabitsPageSettings,
} from "../@common/localstorage";
import { getCompletion, getDateWindow } from "../@common/transforms";
import { HabitUI } from "../@common/types";
import { goToHabitPage } from "../@common/utils";
import {
  AddHabitButton,
  HabitCard,
  NavScaffold,
  SortOptions,
} from "../@components";
import { Page, TabBar } from "../@elements";

const pageSettings = signal(INITIAL_SETTINGS.habitsPage);
const totalOverviewMonths = derive(
  () => HOMEPAGE_OVERVIEW_TABS[pageSettings.value.tabIndex].months
);
effect(() => console.log(pageSettings.value.sortOptionIndex));
effect(() => console.log(totalOverviewMonths.value));
const habits = signal<HabitUI[]>([]);
const sortedHabits = derive(() => {
  console.log(`updating SORTED HABITS`);

  const selectedOption =
    HOMEPAGE_SORT_OPTIONS[pageSettings.value.sortOptionIndex];
  const totalMonths = totalOverviewMonths.value;
  const { startDate, endDate } = getDateWindow(totalMonths);
  const optionLabel = selectedOption.label;
  const sortedHabitsWithCompletion = habits.value.map((habit) => ({
    ...habit,
    completion: getCompletion(habit, startDate, endDate).percent,
  }));
  sortedHabitsWithCompletion.sort((a, b) => {
    if (optionLabel === "Completion (Highest first)")
      return b.completion - a.completion;
    if (optionLabel === "Completion (Lowest first)")
      return a.completion - b.completion;
    if (optionLabel === "Date created (Oldest first)") return a.id - b.id;

    return b.id - a.id;
  });
  console.log(sortedHabitsWithCompletion);

  return sortedHabitsWithCompletion;
});
const sortedActiveHabits = derive(() =>
  sortedHabits.value.filter((hab) => !hab.isStopped)
);
const sortedStoppedHabits = derive(() =>
  sortedHabits.value.filter((hab) => hab.isStopped)
);

const onSortOptionChange = (optionIndex) => {
  updateHabitsPageSettings({
    ...pageSettings.value,
    sortOptionIndex: optionIndex,
  });
  pageSettings.value = getHabitsPageSettings();
};

const onTabChange = (tabIndex: number) => {
  updateHabitsPageSettings({ ...pageSettings.value, tabIndex });
  pageSettings.value = getHabitsPageSettings();
};

const triggerPageDataRefresh = () => {
  console.log(`triggering refresh`);

  habits.value = fetchHabits();
  pageSettings.value = getHabitsPageSettings();
};

const onPageMount = () => {
  intializeTrackerEmptyDays();
  triggerPageDataRefresh();
  window.addEventListener("pageshow", triggerPageDataRefresh);
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
        "All habits",
        SortOptions({
          classNames: "mt2 mr2",
          iconSize: 22,
          selectedOptionIndex: dobject(pageSettings).prop("sortOptionIndex"),
          onChange: onSortOptionChange,
        }),
      ],
    }),
    content: m.Div({
      children: [
        TabBar({
          classNames: "nl1 f6",
          tabs: HOMEPAGE_OVERVIEW_TABS.map((ov) => ov.label),
          selectedTabIndex: dobject(pageSettings).prop("tabIndex"),
          onTabChange: onTabChange,
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
        m.Div(
          m.For({
            subject: sortedActiveHabits,
            itemKey: "id",
            map: (activeHabit) =>
              HabitCard({
                classNames: "mt4",
                habit: activeHabit,
                months: totalOverviewMonths,
                onClick: () => goToHabitPage(activeHabit.value.id),
              }),
          })
        ),
        m.Div(
          m.For({
            subject: sortedStoppedHabits,
            itemKey: "id",
            n: 0,
            nthChild: m.Div({
              class: "silver f6 mt5 mb3",
              children: derive(() =>
                sortedStoppedHabits.value.length
                  ? "OLD HABITS (DIE HARD, LOL)"
                  : ""
              ),
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
      ],
    }),
    navbarTop: AddHabitButton({}),
  }),
});
