import { derive, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { HOMEPAGE_OVERVIEW_TABS } from "./@common/constants";
import { fetchHabits } from "./@common/localstorage";
import { Habit } from "./@common/types";
import { CompletionStatusMap } from "./@components";
import { Button, Page, Scaffold, TabBar } from "./@elements";

const habits = signal<Habit[]>([]);
const selectedTabIndex = signal(0);
const totalOverviewMonths = derive(
  () => HOMEPAGE_OVERVIEW_TABS[selectedTabIndex.value].months
);
const today = new Date();

export default Page({
  onMount: () => {
    const updatedHabits = fetchHabits();
    updatedHabits.sort((a, b) => b.id - a.id);
    habits.value = updatedHabits;
  },
  body: Scaffold({
    classNames: "bg-near-white ph3",
    header: m.Div({
      class: "flex items-start justify-between",
      children: [
        "Daily habits",
        m.Div({
          class: "bg-light-gray ba br3 b--moon-gray mt1 pa2 f6",
          children: [
            m.Span({
              class: "f7 mid-gray",
              children: "Sort by",
            }),
            m.Span({
              class: "ml1 f6",
              // children: "&#128344;",
              children: "&#128175;",
            }),
          ],
        }),
      ],
    }),
    content: m.Div({
      children: [
        TabBar({
          classNames: "w-60 nl1 b f7 mb3",
          selectedTabClassNames: "pv2",
          tabs: HOMEPAGE_OVERVIEW_TABS.map((ov) => ov.label),
          selectedTabIndex: selectedTabIndex,
          onTabChange: (tabIndex) => (selectedTabIndex.value = tabIndex),
        }),
        m.If({
          subject: derive(() => habits.value.length),
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
            subject: habits,
            map: (habit) => {
              return m.Div({
                class: "mb3 bg-white br4 pa3",
                onclick: () => (location.href = `/habit/?id=${habit.id}`),
                children: [
                  m.Div({
                    class: "flex items-center justify-between nt1 mb2",
                    children: [
                      m.Div({
                        class: "f5 b",
                        children: habit.title,
                      }),
                      m.Div({
                        class: "f6 silver b",
                        children: "57%",
                      }),
                    ],
                  }),
                  CompletionStatusMap({
                    habitCreationTime: habit.id,
                    trackRecord: habit.tracker,
                    completionLevels: habit.levels.length,
                    colorIndex: habit.colorIndex,
                    currentYear: today.getFullYear(),
                    currentMonth: today.getMonth(),
                    monthsCount: totalOverviewMonths,
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
        className: "mv3 shadow-4",
        label: dstring`Add new habit`,
        onTap: () => (location.href = "/edit/"),
      }),
    }),
  }),
});
