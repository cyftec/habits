import { derive, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { DAYS_OF_WEEK, MONTHS } from "../../@common/constants";
import {
  intializeTrackerEmptyDays,
  saveHabitInStore,
  tryFetchingHabitUsingParams,
} from "../../@common/localstorage";
import { Habit, StoreHabitID } from "../../@common/types";
import {
  getCompletionPercentage,
  getDaysDifference,
  getMilestone,
  vibrateOnTap,
} from "../../@common/utils";
import { Section } from "../../@components";
import { Button, ColorDot, Icon, Modal, Page, Scaffold } from "../../@elements";

const error = signal("");
const habit = signal<Habit | undefined>(undefined);
const deleteActionModalOpen = signal(false);
const updateLevelModalOpen = signal(false);
const updateLevelModalData = signal({
  date: new Date(),
  selectedLevelIndex: 0,
});
const pageTitle = derive(() => (habit.value ? habit.value.title : "Loading.."));

const acheievemnts = derive(() => {
  const currentHabit = habit.value;
  if (!currentHabit) return [];
  const initialAcheievments = currentHabit.levels.map((_) => 0);

  const acheievemntsList = currentHabit.tracker.reduce((arr, status) => {
    if (status > -1) arr[status] = arr[status] ? arr[status] + 1 : 1;
    return arr;
  }, initialAcheievments);
  const achTotal = acheievemntsList.reduce((a, b) => a + b);
  const list = acheievemntsList.map((ach, i) => ({
    level: currentHabit.levels[i],
    total: ach,
    percent: Math.round((100 * ach) / achTotal),
  }));

  return list;
});

const completion = derive(() =>
  habit.value ? getCompletionPercentage(habit.value, 20) : 0
);
const milestoneAchieved = derive(() => {
  const compl = completion.value;
  const hab = habit.value;
  return hab ? getMilestone(hab.milestones, compl) : undefined;
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

const updateLevel = (levelIndex: number) => {
  if (!habit.value) return;
  const updatedTracker = [...habit.value.tracker];
  const index = getDaysDifference(
    new Date(habit.value.id),
    updateLevelModalData.value.date
  );
  updatedTracker[index] = levelIndex;
  const habitID: StoreHabitID = `h.${habit.value.id}`;
  habit.value = { ...habit.value, tracker: updatedTracker };
  saveHabitInStore(habitID, habit.value);
  updateLevelModalOpen.value = false;
};

const onPageMount = () => {
  intializeTrackerEmptyDays();
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
            className: "mt1 mr1 ba b--silver bw1 br-100 pa1 noselect",
            size: 18,
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
                      const habitID: StoreHabitID = `h.${
                        habit.value?.id || -1
                      }`;
                      if (habitID in localStorage)
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
        Modal({
          classNames: "f5 normal ba bw0 outline-0",
          isOpen: updateLevelModalOpen,
          onTapOutside: () => (updateLevelModalOpen.value = false),
          content: m.Div({
            class: "mnw5",
            children: [
              m.Div({
                class: "f5 b tc pa3",
                children: derive(() =>
                  updateLevelModalData.value.date.toDateString()
                ),
              }),
              m.Div({
                class: "f5 mb1",
                children: m.For({
                  subject: derive(() => habit.value?.levels || []),
                  map: (level, levelIndex) => {
                    const optionCSS = dstring`flex items-center pv3 pa3 bt b--moon-gray pointer ${() =>
                      levelIndex ===
                      updateLevelModalData.value.selectedLevelIndex
                        ? "bg-near-white black"
                        : "gray"}`;

                    return m.Div({
                      class: optionCSS,
                      onclick: vibrateOnTap(() => updateLevel(levelIndex)),
                      children: [m.Span(level)],
                    });
                  },
                }),
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
                        n: Infinity,
                        nthChild: m.Div({
                          class:
                            "flex items-center justify-between mt2 pt1 bt bw1 b--near-white b mid-gray",
                          children: [
                            m.Div(`Overall`),
                            m.Div({
                              class: "flex items-center",
                              children: [
                                Icon({
                                  className: dstring`mr2 ${() =>
                                    milestoneAchieved.value?.color}`,
                                  size: 20,
                                  iconName: derive(
                                    () => `${milestoneAchieved.value?.icon}`
                                  ),
                                }),
                                derive(
                                  () => `${milestoneAchieved.value?.label}`
                                ),
                                m.Span({ class: "ml1" }),
                                m.Div(derive(() => ` (${completion.value}%)`)),
                              ],
                            }),
                          ],
                        }),
                        map: (acheievemnt, i) =>
                          m.Div({
                            class: "flex items-center justify-between mb1",
                            children: [
                              m.Div(derive(() => `${acheievemnt.level}`)),
                              m.Div(
                                derive(
                                  () =>
                                    `${acheievemnt.total} (${acheievemnt.percent}%)`
                                )
                              ),
                            ],
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
                            "mxh5 mxh6-ns nt2 bb bw1 b--near-white mh2 overflow-y-scroll",
                          children: [
                            m.Div({
                              class:
                                "h3 absolute left-0 right-0 bg-to-top-white z-999",
                            }),
                            m.Div({
                              children: m.For({
                                subject: weekwiseTracker,
                                n: 0,
                                nthChild: m.Div({ class: "pv4" }),
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
                                              onClick: () => {
                                                if (habit.value?.isStopped)
                                                  return;
                                                updateLevelModalOpen.value =
                                                  true;
                                                updateLevelModalData.value = {
                                                  date: day.date,
                                                  selectedLevelIndex:
                                                    day.level ?? 0,
                                                };
                                              },
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
