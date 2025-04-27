import { derive, dstring, effect, signal } from "@cyftech/signal";
import { m, MHtmlElement } from "@mufw/maya";
import { DAYS_OF_WEEK, MONTHS } from "../../@common/constants";
import { Habit } from "../../@common/types";
import { tryFetchingHabitUsingParams } from "../../@common/utils";
import { Section } from "../../@components";
import { Button, ColorDot, Icon, Modal, Page, Scaffold } from "../../@elements";

const error = signal("");
const habit = signal<Habit | undefined>(undefined);
const deleteActionModalOpen = signal(false);
const pageTitle = derive(() => (habit.value ? habit.value.title : "Loading.."));

const acheievemnts = derive(() => {
  const currentHabit = habit.value;
  if (!currentHabit) return [];
  const acheievemntsList = currentHabit.tracker.reduce((arr, status) => {
    if (status > -1) arr[status] = arr[status] ? arr[status] + 1 : 1;
    return arr;
  }, [] as number[]);
  return acheievemntsList;
});

const weekwiseTracker = derive(() => {
  const currentHabit = habit.value;
  if (!currentHabit) return [];
  const firstDayTime = currentHabit.id;
  const firstDay = new Date(firstDayTime);
  const firstDayIndex = firstDay.getDay();
  const tracker = currentHabit.tracker;
  const trackerStartingSunday: (number | undefined)[] = [...tracker];
  Array(firstDayIndex)
    .fill(undefined)
    .forEach((x) => trackerStartingSunday.unshift(x));
  Array(7 - (trackerStartingSunday.length % 7))
    .fill(undefined)
    .forEach((x) => trackerStartingSunday.push(x));
  const weeklyTracker: { level: number | undefined; date: Date }[][] = [];

  for (let i = 0; i < trackerStartingSunday.length; i++) {
    const index = Math.floor(i / 7);
    if (!weeklyTracker[index]) weeklyTracker[index] = [];
    weeklyTracker[index][i % 7] = {
      level: trackerStartingSunday[i],
      date: new Date(
        firstDay.getFullYear(),
        firstDay.getMonth(),
        firstDay.getDate() - firstDayIndex + i
      ),
    };
  }

  return weeklyTracker;
});

const onPageMount = () => {
  const [fetchedHabit, err] = tryFetchingHabitUsingParams();
  if (err || !fetchedHabit) {
    error.value = err || "Nohabit found for 'id' in query param";
    return;
  }
  habit.value = fetchedHabit;
};

export default Page({
  onMount: onPageMount,
  body: Scaffold({
    classNames: "bg-white ph3",
    header: m.Div({
      class: "flex items-start justify-between",
      children: [
        m.Div({
          class: dstring`${() =>
            pageTitle.value.length > 22 ? "f2dot66" : ""}`,
          children: pageTitle,
        }),
        m.If({
          subject: derive(() => habit.value?.isStopped),
          isFalsy: Icon({
            className: "mt2 mr1 ba b--moon-gray bw1 br-100 pa1 noselect",
            size: 22,
            iconName: "edit",
            onClick: () => {
              if (habit.value) location.href = `edit/?id=${habit.value.id}`;
            },
          }),
        }),
      ],
    }),
    content: m.Div({
      children: [
        Modal({
          classNames: "bn",
          isOpen: deleteActionModalOpen,
          onTapOutside: () => (deleteActionModalOpen.value = false),
          content: m.Div({
            class: "pa3 f5",
            children: [
              m.Div({
                class: "mb3 b f4",
                children: dstring`Delete '${() => habit.value?.title}'?`,
              }),
              m.Div({
                class: "mb4",
                children: [
                  `
                  All the data and the acheivements associated with this habit will be lost forever
                  with this action, and cannot be reversed.
                  `,
                  m.Br({}),
                  m.Br({}),
                  `
                  Are you sure, you want to DELETE this habit permanently?
                  `,
                ],
              }),
              m.Div({
                class: "flex items-center justify-between f6",
                children: [
                  Button({
                    className: "w-25 pv2 ph3 mr1 b",
                    children: "No",
                    onTap: () => (deleteActionModalOpen.value = false),
                  }),
                  Button({
                    className: "pv2 ph3 ml2 b red",
                    children: "Yes, delete permanently",
                    onTap: () => {
                      const habitID = `h.${habit.value?.id}`;
                      localStorage.removeItem(habitID);
                      deleteActionModalOpen.value = false;
                      location.href = "/habits/";
                    },
                  }),
                ],
              }),
            ],
          }),
        }),
        m.If({
          subject: error,
          isTruthy: m.Div({ class: "red", children: error }),
          isFalsy: m.Div(
            m.If({
              subject: habit,
              isFalsy: m.Div({ class: "", children: "habit.." }),
              isTruthy: m.Div({
                children: [
                  m.If({
                    subject: derive(() => !!habit.value?.isStopped),
                    isTruthy: m.Div([
                      m.Div({
                        class: "red mb3",
                        children: "Status: STOPPED PERMANENTLY",
                      }),
                      Button({
                        className: "pv2 ph3 nt2 mb4 red",
                        onTap: () => (deleteActionModalOpen.value = true),
                        children: "Delete Permanently",
                      }),
                    ]),
                  }),
                  Section({
                    title: "Acheivment",
                    child: m.Div({
                      children: m.For({
                        subject: acheievemnts,
                        map: (acheievemnt, i) =>
                          m.Div({
                            children: derive(
                              () => `${habit.value?.levels[i]}: ${acheievemnt}%`
                            ),
                          }),
                      }),
                    }),
                  }),
                  Section({
                    title: "Tracker",
                    child: m.Div({
                      children: [
                        m.Div({
                          class: "mh2 flex items-center justify-between",
                          children: m.For({
                            subject: DAYS_OF_WEEK,
                            map: (day) =>
                              m.Div({
                                class:
                                  "h2 w2 br-100 gray f7 flex items-center justify-center",
                                children: day.charAt(0),
                              }),
                          }),
                        }),
                        m.Div({
                          onmount: (el) =>
                            el.scroll({
                              top: el.scrollHeight - el.clientHeight,
                            }),
                          class:
                            "h5 nt2 bb bw1 b--light-gray mh2 overflow-y-scroll",
                          children: [
                            m.Div({
                              class:
                                "h3 absolute left-0 right-0 bg-to-top-white z-999",
                            }),
                            m.Div({
                              children: m.For({
                                subject: weekwiseTracker,
                                map: (week) =>
                                  m.Div({
                                    class: "flex items-center h-60",
                                    children: [
                                      m.Div({
                                        class:
                                          "w-100 mb3 flex items-center justify-between",
                                        children: m.For({
                                          subject: week,
                                          map: (day) => {
                                            const dateNum = day.date.getDate();
                                            const monthIndex =
                                              day.date.getMonth();
                                            const monthName = MONTHS[
                                              monthIndex
                                            ].substring(0, 3);
                                            const dateText = `${
                                              dateNum === 1
                                                ? monthIndex === 0
                                                  ? day.date
                                                      .getFullYear()
                                                      .toString()
                                                  : monthName
                                                : dateNum
                                            }`;

                                            return ColorDot({
                                              classNames:
                                                "h2 w2 flex items-center justify-center f7",
                                              colorIndex:
                                                habit.value?.colorIndex ?? 0,
                                              level: day.level ?? -1,
                                              totalLevels:
                                                habit.value?.levels.length || 2,
                                              textContent: dateText,
                                              showText: day.level !== undefined,
                                            });
                                          },
                                        }),
                                      }),
                                    ],
                                  }),
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            })
          ),
        }),
      ],
    }),
    bottombar: m.Div({
      class: "pb3",
      children: Button({
        className: "pa3 flex items-center",
        children: [
          Icon({ iconName: "arrow_back" }),
          m.Span({
            class: "ml1",
            children: `Go Back`,
          }),
        ],
        onTap: () => history.back(),
      }),
    }),
  }),
});
