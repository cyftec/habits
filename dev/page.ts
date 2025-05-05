import { derive, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  intializeTrackerEmptyDays,
  updateInteractionTime,
} from "./@common/localstorage";
import {
  areSameDates,
  getDayLabel,
  getDayStatus,
  getGapDate,
  getHabitsForDate,
  getLastNDays,
  getNewHabit,
  getWeekdayName,
  isFutureDay,
  isLastInteractionLongBack,
  updateHabitStatus,
} from "./@common/transforms";
import { DailyStatus } from "./@common/types";
import { goToHabitPage, goToNewHabitsPage, handleCTA } from "./@common/utils";
import {
  AddHabitButton,
  HabitStatusEditModal,
  NavScaffold,
} from "./@components";
import { ColorDot, Link, Page, ProgressBar } from "./@elements";

const now = new Date();
const progress = signal(0);
const itsTimeToRefresh = signal(false);
const sevenDays = getLastNDays(getGapDate(now, 2), 7);
const selectedDate = signal(now);
const habits = derive(() => getHabitsForDate(selectedDate.value));
const habitsStatusLabel = derive(() => {
  const statuses = habits.value.map(
    (hab) => getDayStatus(hab.tracker, selectedDate.value) as DailyStatus
  );
  const status = {
    done: statuses.reduce((sum, st) => sum + (st.level.code > 0 ? 1 : 0), 0),
    notDone: statuses.reduce(
      (sum, st) => sum + (st.level.code === 0 ? 1 : 0),
      0
    ),
  };

  if (status.done === 0 && status.notDone === 0) return ``;
  if (status.done === 0 && status.notDone > 0)
    return `Update below ${status.notDone} tsaks for the day.`;
  if (status.done > 0 && status.notDone === 0)
    return `Great! All tasks updated.`;

  return `${status.done} done. ${status.notDone} more to go.`;
});
const isStatusEditorOpen = signal(false);
const statusEditableHabitIndex = signal(0);
const editableHabit = derive(
  () => habits.value?.[statusEditableHabitIndex.value] || getNewHabit()
);
const transitionToHabitsPage = () => {
  itsTimeToRefresh.value = isLastInteractionLongBack();
  const tickerID = setInterval(() => {
    progress.value += 1;
    if (progress.value >= 100) {
      clearInterval(tickerID);
      itsTimeToRefresh.value = false;
      updateInteractionTime(new Date());
    }
  }, 30);
};

const triggerPageDataRefresh = () => {
  intializeTrackerEmptyDays();
  selectedDate.value = new Date();
};

const onPageMount = () => {
  transitionToHabitsPage();
  intializeTrackerEmptyDays();
  triggerPageDataRefresh();
  window.addEventListener("pageshow", triggerPageDataRefresh);
};

export default Page({
  classNames: "bg-white",
  onMount: onPageMount,
  body: m.Div({
    children: [
      HabitStatusEditModal({
        isOpen: isStatusEditorOpen,
        showTitleInHeader: true,
        habit: editableHabit,
        date: selectedDate,
        onClose: () => {
          isStatusEditorOpen.value = false;
          statusEditableHabitIndex.value = 0;
        },
        onChange: function (levelCode: number): void {
          console.log(levelCode);
          updateHabitStatus(editableHabit.value, levelCode, selectedDate.value);
          isStatusEditorOpen.value = false;
          selectedDate.value = new Date(selectedDate.value.getTime() + 1);
        },
      }),
      m.If({
        subject: derive(() => itsTimeToRefresh.value && progress.value < 100),
        isTruthy: m.Div({
          class: "flex flex-column justify-center items-center vh-100",
          children: [
            m.Img({
              class: "mt6 br4",
              src: "/assets/habits-logo.png",
              height: "100",
              width: "100",
            }),
            m.Div({
              class: "f3 b mv3",
              children: "Habits",
            }),
            ProgressBar({
              classNames: "w-40",
              progress: progress,
            }),
            m.Div({
              class: "mt7 pv4",
              children: "A Cyfer Product",
            }),
          ],
        }),
        isFalsy: NavScaffold({
          classNames: "ph3 bg-white",
          route: "/",
          header: "Tasks for the day",
          content: m.Div({
            children: [
              m.Div({
                onmount: (el) => (el.scrollLeft = el.scrollWidth),
                class:
                  "sticky top-3 bg-white mt2 pb2 flex items-center justify-between z-999 w-100",
                children: m.For({
                  subject: sevenDays,
                  map: (date) => {
                    const isFuture = isFutureDay(date);
                    const isSelectedDay = areSameDates(
                      selectedDate.value,
                      date
                    );
                    return m.Div({
                      class: `bw1 ba br-pill pa2 tc ${
                        isSelectedDay
                          ? "black b b--silver"
                          : isFuture
                          ? "light-gray b--transparent"
                          : "light-silver pointer b--transparent"
                      }`,
                      onclick: handleCTA(
                        () =>
                          !(isSelectedDay || isFuture) &&
                          (selectedDate.value = date)
                      ),
                      children: [
                        m.Div({
                          class: "f7 ",
                          children: getWeekdayName(date.getDay(), 3),
                        }),
                        m.Div({
                          class: "mt2 f4",
                          children: ("0" + date.getDate()).slice(-2),
                        }),
                      ],
                    });
                  },
                }),
              }),
              m.Div({
                class: "mt3 mb2 f4 b",
                children: derive(() => getDayLabel(selectedDate.value)),
              }),
              m.Div({
                class: "mb4 pb2 silver",
                children: habitsStatusLabel,
              }),
              m.Div({
                class: "mt4",
                children: m.For({
                  subject: habits,
                  n: Infinity,
                  nthChild: Link({
                    classNames: "flex pl5 pr3 nl3 mt4",
                    onClick: goToNewHabitsPage,
                    children: derive(() =>
                      habits.value.length === 0
                        ? "No habit for the day! Add one."
                        : habits.value.length < 5
                        ? `Only ${habits.value.length} habits a day! Add more.`
                        : ``
                    ),
                  }),
                  map: (habit, i) => {
                    const status = getDayStatus(
                      habit.tracker,
                      selectedDate.value
                    ) as DailyStatus;

                    return m.Div({
                      class: "mt4 flex items-center",
                      children: [
                        ColorDot({
                          classNames: `pa3 mr3 ba b ${
                            status.level.code < 1
                              ? "b--light-silver"
                              : "b--transparent"
                          }`,
                          colorIndex: habit.colorIndex,
                          level: status.level.code,
                          totalLevels: habit.levels.length,
                          icon: "check",
                          iconSize: 22,
                          showText: status.level.code > 0,
                          onClick: () => {
                            isStatusEditorOpen.value = true;
                            statusEditableHabitIndex.value = i;
                          },
                        }),
                        m.Div({
                          class: "pointer",
                          onclick: handleCTA(() => goToHabitPage(habit.id)),
                          children: [
                            m.Div({
                              class: "f5 fw6 f4-ns fw4-ns",
                              children: habit.title,
                            }),
                            m.Div({
                              class: "f6 light-silver pt05",
                              children: "7 days in a row. Well done!!",
                            }),
                          ],
                        }),
                      ],
                    });
                  },
                }),
              }),
              m.Div({ class: "pv6" }),
            ],
          }),
          navbarTop: AddHabitButton({}),
        }),
      }),
    ],
  }),
});
