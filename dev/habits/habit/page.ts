import { derive, dobject, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { intializeTrackerEmptyDays } from "../../@common/localstorage";
import {
  getAchievedMilestone,
  getCompletion,
  getHabitFromUrl,
  getMonthName,
  getNewHabit,
  getWeekdayName,
  getWeekwiseStatus,
  updateHabitStatus,
} from "../../@common/transforms";
import { HabitUI } from "../../@common/types";
import { goToHabitEditPage } from "../../@common/utils";
import {
  GoalStatus,
  GoBackButton,
  HabitDeleteModal,
  HabitStatusEditModal,
  Section,
} from "../../@components";
import { Button, ColorDot, Icon, Page, Scaffold } from "../../@elements";

const error = signal("");
const habit = signal<HabitUI>(getNewHabit());
const {
  id: habitId,
  title: pageTitle,
  colorIndex: habitColorIndex,
  levels: habitLevels,
  milestones: habitMilestones,
  isStopped: habitIsStopped,
} = dobject(habit).props;
const showGoalStatus = signal(false);
const deleteActionModalOpen = signal(false);
const updateLevelModalOpen = signal(false);
const updateLevelModalData = signal({
  date: new Date(),
  selectedLevelIndex: 0,
});

const acheievemnts = derive(() => {
  const currentHabit = habit.value;
  if (!currentHabit) return [];
  const initialAcheievments = currentHabit.levels.map((_) => 0);

  const acheievemntsList = currentHabit.tracker.reduce((arr, status) => {
    if (status.level.code > -1)
      arr[status.level.code] = arr[status.level.code]
        ? arr[status.level.code] + 1
        : 1;
    return arr;
  }, initialAcheievments);
  const achTotal = acheievemntsList.reduce((a, b) => a + b);
  const list = acheievemntsList.map((ach, i) => ({
    level: currentHabit.levels[i],
    count: ach,
    weightage: ach * (i / (currentHabit.levels.length - 1)),
    percent: Math.round((100 * ach) / achTotal),
  }));

  return list;
});

const completion = derive(
  () => getCompletion(habit.value, new Date(habitId.value), new Date()).percent
);
const milestoneAchieved = derive(() =>
  getAchievedMilestone(habitMilestones.value, completion.value)
);
const {
  icon: achievedMilestoneIcon,
  label: achievedMilestoneLabel,
  color: achievedMilestoneColor,
} = dobject(milestoneAchieved).props;

const weekwiseTracker = derive(() => {
  const currentHabit = habit.value;
  if (!currentHabit) return [];
  return getWeekwiseStatus(currentHabit);
});

const triggerPageDataRefresh = () => {
  const fetchedHabit = getHabitFromUrl();
  if (!fetchedHabit) {
    error.value = "Incorrect habit ID provided in the query params.";
    return;
  }
  habit.value = fetchedHabit;
};

const openDeleteModal = () => (deleteActionModalOpen.value = true);
const closeDeleteModal = () => (deleteActionModalOpen.value = false);
const onHabitDelete = () => {
  closeDeleteModal();
  history.back();
};

const updateLevel = (levelCode: number) => {
  if (!habit.value) return;
  updateHabitStatus(habit.value, levelCode, updateLevelModalData.value.date);
  updateLevelModalOpen.value = false;
  triggerPageDataRefresh();
};

const onPageMount = () => {
  intializeTrackerEmptyDays();
  triggerPageDataRefresh();
  window.addEventListener("pageshow", triggerPageDataRefresh);
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
          subject: habitIsStopped,
          isFalsy: Icon({
            className: "mt1 mr1 ba b--silver bw1 br-100 pa1 noselect",
            size: 18,
            iconName: "edit",
            onClick: () => goToHabitEditPage(habitId.value),
          }),
        }),
      ],
    }),
    content: m.Div({
      children: [
        HabitDeleteModal({
          isOpen: deleteActionModalOpen,
          habit: habit,
          onClose: closeDeleteModal,
          onDone: onHabitDelete,
        }),
        HabitStatusEditModal({
          isOpen: updateLevelModalOpen,
          habit: habit,
          date: dobject(updateLevelModalData).prop("date"),
          onClose: () => (updateLevelModalOpen.value = false),
          onChange: updateLevel,
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
                    subject: habitIsStopped,
                    isTruthy: m.Div([
                      m.Div({
                        class: "red mb3",
                        children: "Status: STOPPED PERMANENTLY",
                      }),
                      Button({
                        className: "pv2 ph3 nt2 mb4 red",
                        onTap: openDeleteModal,
                        children: "Delete Permanently",
                      }),
                    ]),
                  }),
                  Section({
                    classNames: "pb3",
                    title: dstring`Completion status ${() =>
                      showGoalStatus.value
                        ? ""
                        : `(target ${habitMilestones.value[0].percent}%)`}`,
                    children: [
                      m.Div({
                        class: "mt3",
                        children: m.For({
                          subject: derive(() =>
                            acheievemnts.value.slice().reverse()
                          ),
                          n: Infinity,
                          nthChild: m.Div({
                            class:
                              "flex items-center justify-between mt2 pt1 bt bw1 b--near-white b mid-gray",
                            children: [
                              m.Div({
                                class: "flex items-center",
                                children: [
                                  Icon({
                                    className: dstring`mr1 ${achievedMilestoneColor}`,
                                    size: 12,
                                    iconName: achievedMilestoneIcon,
                                  }),
                                  achievedMilestoneLabel,
                                ],
                              }),
                              m.Div({
                                class: "flex items-center",
                                children: [
                                  derive(() => {
                                    const outOf = acheievemnts.value.reduce(
                                      (sum, ach) => sum + ach.count,
                                      0
                                    );
                                    const times = acheievemnts.value.reduce(
                                      (sum, ach) => sum + ach.weightage,
                                      0
                                    );
                                    return `${times.toFixed(1)} / ${outOf}`;
                                  }),
                                  m.Span({ class: "ml1" }),
                                  m.Div(
                                    derive(() => ` (${completion.value}%)`)
                                  ),
                                ],
                              }),
                            ],
                          }),
                          map: (acheievemnt, i) =>
                            m.Div({
                              class: "flex items-center justify-between mb2",
                              children: [
                                m.Div({
                                  class: "flex items-center",
                                  children: [
                                    ColorDot({
                                      classNames: `pa1 mr2`,
                                      colorIndex: habitColorIndex,
                                      level: acheievemnt.level.code,
                                      totalLevels: habitLevels.value.length,
                                      isRectangular: true,
                                    }),
                                    m.Div(
                                      derive(() => `${acheievemnt.level.name}`)
                                    ),
                                  ],
                                }),
                                m.Div(
                                  derive(
                                    () =>
                                      `${acheievemnt.count} times (${acheievemnt.percent}%)`
                                  )
                                ),
                              ],
                            }),
                        }),
                      }),
                      m.If({
                        subject: showGoalStatus,
                        isTruthy: GoalStatus({
                          classNames: "pt4 mt3 mb3",
                          milestones: habitMilestones,
                          achievedMilestone: milestoneAchieved,
                          completionPercent: completion,
                        }),
                      }),
                      Button({
                        className: "pa2 ph3 mt4 mb2",
                        children: dstring`${() =>
                          showGoalStatus.value
                            ? "Hide"
                            : "Show"} target goal status`,
                        onTap: () =>
                          (showGoalStatus.value = !showGoalStatus.value),
                      }),
                    ],
                  }),
                  Section({
                    title: "Tracker",
                    children: [
                      m.Div({
                        class: "mh2 flex items-center justify-between",
                        children: m.For({
                          subject: Array(7).fill(0),
                          map: (_, dayIndex) =>
                            m.Div({
                              class:
                                "h2 w2 br-100 gray f7 flex items-center justify-center",
                              children: getWeekdayName(dayIndex, 1),
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
                            class: dstring`absolute left-0 right-0 bg-to-top-white z-999 ${() =>
                              weekwiseTracker.value.length > 4 ? "h3" : ""}`,
                          }),
                          m.Div({
                            children: m.For({
                              subject: weekwiseTracker,
                              n: 0,
                              nthChild: m.Div({
                                class: derive(() =>
                                  weekwiseTracker.value.length > 4
                                    ? "pv3 mt2"
                                    : "pv2"
                                ),
                              }),
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
                                          const monthName = getMonthName(
                                            monthIndex,
                                            3
                                          );
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
                                            colorIndex: habitColorIndex,
                                            level: day.level.code,
                                            totalLevels:
                                              habitLevels.value.length || 2,
                                            textContent: dateText,
                                            showText: day.level !== undefined,
                                            onClick: () => {
                                              if (habitIsStopped.value) return;
                                              updateLevelModalOpen.value = true;
                                              updateLevelModalData.value = {
                                                date: day.date,
                                                selectedLevelIndex:
                                                  day.level.code,
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
                ],
              }),
            })
          ),
        }),
      ],
    }),
    bottombar: m.Div({
      class: "pb3",
      children: GoBackButton({}),
    }),
  }),
});
