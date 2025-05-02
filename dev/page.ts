import { derive, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { DAY_IN_MS, DAYS_OF_WEEK } from "./@common/constants";
import {
  getHabitsForDate,
  intializeTrackerEmptyDays,
} from "./@common/localstorage";
import { DailyStatus } from "./@common/types";
import {
  getDayStatus,
  getHabitUI,
  getLastTwoWeeks,
  getMomentZeroDate,
  getNewHabit,
  goToHabitPage,
  updateHabitStatus,
  vibrateOnTap,
} from "./@common/utils";
import {
  AddHabitButton,
  HabitStatusEditModal,
  NavScaffold,
} from "./@components";
import { ColorDot, Page, ProgressBar } from "./@elements";

const progress = signal(100);
const selectedDate = signal(new Date());
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

  if (status.done === 0)
    return `Update below ${status.notDone} tsaks for the day.`;
  if (status.notDone === 0) return `Great! All tasks updated.`;

  return `${status.done} done. ${status.notDone} more to go.`;
});
const isStatusEditorOpen = signal(false);
const statusEditableHabitIndex = signal(0);
const editableHabit = derive(
  () =>
    habits.value?.[statusEditableHabitIndex.value] || getHabitUI(getNewHabit())
);
const transitionToHabitsPage = () => {
  const tickerID = setInterval(() => {
    progress.value += 1;
    if (progress.value >= 100) {
      clearInterval(tickerID);
    }
  }, 0);
};

const triggerPageDataRefresh = () => {
  selectedDate.value = new Date();
};

const onPageMount = () => {
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
        onTapOutside: () => {
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
        subject: derive(() => progress.value > 99),
        isFalsy: m.Div({
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
        isTruthy: NavScaffold({
          classNames: "ph3 bg-white",
          route: "/",
          header: "Todos in a day",
          content: m.Div({
            children: [
              m.Div({
                onmount: (el) => (el.scrollLeft = el.scrollWidth),
                class:
                  "sticky top-3 bg-white mt3 pb2 flex items-center justify-between-ns overflow-x-scroll z-999 w-100 hide-scrollbar",
                children: m.For({
                  subject: getLastTwoWeeks(getMomentZeroDate(new Date())),
                  map: (date) => {
                    const today = getMomentZeroDate(new Date());
                    const futureTimeDiff = date.getTime() - today.getTime();
                    const isFuture = futureTimeDiff >= DAY_IN_MS;
                    const dateSelected = getMomentZeroDate(selectedDate.value);
                    const selectedDayTimeDiff =
                      date.getTime() - dateSelected.getTime();
                    const isSelectedDay =
                      selectedDayTimeDiff < DAY_IN_MS &&
                      selectedDayTimeDiff >= 0;
                    return m.Div({
                      class: `mh1 mh0-ns bw1 ba br-pill pa2 tc ${
                        isSelectedDay || isFuture ? "" : "pointer"
                      } ${
                        isFuture
                          ? "light-gray"
                          : isSelectedDay
                          ? "black b"
                          : "light-silver"
                      } ${isSelectedDay ? "b--silver" : "b--transparent"}`,
                      onclick: () =>
                        !(isSelectedDay || isFuture) &&
                        (selectedDate.value = date),
                      children: [
                        m.Div({
                          class: "f7 ",
                          children: DAYS_OF_WEEK[date.getDay()].substring(0, 3),
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
                children: "Today",
              }),
              m.Div({
                class: "mb4 pb2 silver",
                children: habitsStatusLabel,
              }),
              m.Div({
                class: "mt4",
                children: m.For({
                  subject: habits,
                  map: (habit, i) => {
                    const status = getDayStatus(
                      habit.tracker,
                      selectedDate.value
                    ) as DailyStatus;
                    return m.Div({
                      class: "mt4 flex items-center",
                      children: [
                        ColorDot({
                          classNames: `pa3 mr3 ba ${
                            status.level.code < 1
                              ? "b--light-silver"
                              : "b--transparent"
                          }`,
                          colorIndex: habit.colorIndex,
                          level: status.level.code,
                          totalLevels: habit.levels.length,
                          textContent: "✓",
                          showText: status.level.code > 0,
                          onClick: () => {
                            isStatusEditorOpen.value = true;
                            statusEditableHabitIndex.value = i;
                          },
                        }),
                        m.Div({
                          class: "pointer",
                          onclick: vibrateOnTap(() => goToHabitPage(habit.id)),
                          children: [
                            m.Div({
                              class: "f5 fw6 f4-ns fw4-ns",
                              children: habit.title,
                            }),
                            m.Div({
                              class: "f6 light-silver",
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
