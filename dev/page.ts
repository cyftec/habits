import { compute, derive, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { Habit } from "./@common/types";
import { MonthMap } from "./@components";
import { Button, Page, Scaffold, TabBar } from "./@elements";
import { fetchHabits } from "./@common/localstorage";

const habits = signal<Habit[]>([]);
const TABS = ["Monthly", "Weekly"];
const selectedTabIndex = signal(0);

export default Page({
  onMount: () => {
    const updatedHabits = fetchHabits();
    updatedHabits.sort((a, b) => b.id - a.id);
    habits.value = updatedHabits;
  },
  body: Scaffold({
    classNames: "bg-near-white ph3",
    header: "Daily habits",
    content: m.Div({
      children: [
        m.Div({
          class: "flex items-center justify-between f6 mb3 pb1",
          children: [
            TabBar({
              classNames: "w-60 nl1 b",
              selectedTabClassNames: "pv2",
              tabs: TABS,
              selectedTabIndex: selectedTabIndex,
              onTabChange: (tabIndex) => (selectedTabIndex.value = tabIndex),
            }),
            m.Div({
              class: "bg-light-gray pa2 ba br3 b--moon-gray",
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
            map: (habit) =>
              m.Div({
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
                  MonthMap({
                    classNames: "mt05",
                    month: "January",
                    colorIndex: habit.colorIndex,
                  }),
                  MonthMap({
                    classNames: "mt05",
                    month: "February",
                    colorIndex: habit.colorIndex,
                  }),
                  MonthMap({
                    classNames: "mt05",
                    month: "March",
                    colorIndex: habit.colorIndex,
                  }),
                  MonthMap({
                    classNames: "mt05",
                    month: "April",
                    colorIndex: habit.colorIndex,
                  }),
                ],
              }),
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
