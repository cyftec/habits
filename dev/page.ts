import { compute, derive, dobject, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  HOMEPAGE_OVERVIEW_TABS,
  HOMEPAGE_SORT_OPTIONS,
  MONTHS,
} from "./@common/constants";
import { fetchHabits } from "./@common/localstorage";
import { Habit } from "./@common/types";
import { getCompletionPercentage, getMonthsStatus } from "./@common/utils";
import { MonthMap, SortOptions } from "./@components";
import { Button, Page, Scaffold, TabBar } from "./@elements";

const selectedSortOption = signal<(typeof HOMEPAGE_SORT_OPTIONS)[number]>({
  icon: "calendar_month",
  decending: true,
  label: "Date created (Newest first)",
});
const selectedTabIndex = signal(0);
const totalOverviewMonths = derive(
  () => HOMEPAGE_OVERVIEW_TABS[selectedTabIndex.value].months
);
const habits = signal<Habit[]>([]);
const sortedHabits = derive(() => {
  const selectedOption = selectedSortOption.value;
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
  onMount: () => {
    const updatedHabits = fetchHabits();
    habits.value = updatedHabits;
  },
  body: Scaffold({
    classNames: "bg-near-white ph3",
    header: m.Div({
      class: "flex items-start justify-between",
      children: [
        "Daily habits",
        SortOptions({
          classNames: "mt2 pt1 mr2",
          selectedOption: selectedSortOption,
          onChange: (option) => (selectedSortOption.value = option),
        }),
      ],
    }),
    content: m.Div({
      children: [
        TabBar({
          classNames: "nl1 b f7 mb3",
          selectedTabClassNames: "pv2",
          tabs: HOMEPAGE_OVERVIEW_TABS.map((ov) => ov.label),
          selectedTabIndex: selectedTabIndex,
          onTabChange: (tabIndex) => (selectedTabIndex.value = tabIndex),
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
            subject: sortedHabits,
            itemKey: "id",
            map: (habit) => {
              const { id, title, completion, colorIndex, levels } =
                dobject(habit).props;
              const monthsTrackerList = derive(() =>
                getMonthsStatus(habit.value, totalOverviewMonths.value)
              );

              return m.Div({
                class: "mb3 bg-white br4 pa3",
                onclick: () => (location.href = `/habit/?id=${id}`),
                children: [
                  m.Div({
                    class: "flex items-center justify-between nt1 mb2",
                    children: [
                      m.Div({
                        class: "f5 b",
                        children: title,
                      }),
                      m.Div({
                        class: "f6 silver b",
                        children: dstring`${completion}%`,
                      }),
                    ],
                  }),
                  m.Div({
                    children: m.For({
                      subject: monthsTrackerList,
                      map: (tracker) =>
                        MonthMap({
                          classNames: "mt05",
                          month: MONTHS[tracker.monthIndex],
                          status: tracker.status,
                          colorIndex: colorIndex,
                          totalLevels: levels.value.length,
                        }),
                    }),
                  }),
                ],
              });
            },
          }),
        }),
        m.Div({
          class: "mt6 pv6",
        }),
      ],
    }),
    bottombar: m.Div({
      class: "w-100 flex justify-around",
      children: Button({
        className: "mb4 shadow-4",
        label: dstring`Add new habit`,
        onTap: () => (location.href = "/edit/"),
      }),
    }),
  }),
});
