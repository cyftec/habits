import { compute, derive, op, signal, tmpl, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  intializeTrackerEmptyDays,
  updateInteractionTime,
} from "./@common/localstorage";
import { checkNoHabitsInStore } from "./@common/localstorage/habits";
import {
  areSameDates,
  getDayLabel,
  getDayStatus,
  getGapDate,
  getHabitInfoLabel,
  getHabitsForDate,
  getHabitsStatusLabelForTheDay,
  getLastNDays,
  getNewHabit,
  getWeekdayName,
  isFutureDay,
  isLastInteractionLongBack,
  updateHabitStatus,
} from "./@common/transforms";
import { DailyStatus, HabitUI } from "./@common/types";
import { goToHabitPage, goToNewHabitsPage, handleTap } from "./@common/utils";
import {
  AddHabitButton,
  ColorDot,
  EmptyHomePageIllustration,
  HabitStatusEditModal,
  HTMLPage,
  NavScaffold,
  SplashScreen,
} from "./@components";
import { Link } from "./@elements";

const now = new Date();
const noHabitsInStore = signal(false);
const progress = signal(0);
const itsTimeToRefresh = signal(false);
const showSplashScreen = op(itsTimeToRefresh).andThisIsLT(progress, 100).truthy;
const sevenDays = getLastNDays(getGapDate(now, 2), 7);
const selectedDate = signal(now);
const habits = compute(getHabitsForDate, selectedDate);
const readableDateLabel = compute(getDayLabel, selectedDate);
const habitsStatusLabel = compute(
  getHabitsStatusLabelForTheDay,
  habits,
  selectedDate
);
const createNewHabitBtnLabel = compute(
  (habits: HabitUI[]) =>
    habits.length === 0
      ? "No habit for the day! Add one."
      : habits.length < 5
      ? `Only ${habits.length} habits a day! Add more.`
      : ``,
  habits
);
const isStatusEditorOpen = signal(false);
const statusEditableHabitIndex = signal(0);
const nullishEditableHabit = trap(habits).at(statusEditableHabitIndex);
const editableHabit = trap(nullishEditableHabit).or(getNewHabit());

const openHabitEditor = (habitIndex: number) => {
  isStatusEditorOpen.value = true;
  statusEditableHabitIndex.value = habitIndex;
};
const closeHabitEditor = () => {
  isStatusEditorOpen.value = false;
  statusEditableHabitIndex.value = 0;
};
const onHabitStatusChange = (levelCode: number) => {
  updateHabitStatus(editableHabit.value, levelCode, selectedDate.value);
  isStatusEditorOpen.value = false;
  // force update date to refetch latest habits for the day
  selectedDate.value = new Date(selectedDate.value.getTime() + 1);
};

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
  noHabitsInStore.value = checkNoHabitsInStore();
};

const onPageMount = () => {
  transitionToHabitsPage();
  intializeTrackerEmptyDays();
  triggerPageDataRefresh();
  window.addEventListener("pageshow", triggerPageDataRefresh);
};

export default HTMLPage({
  cssClasses: "bg-white",
  onMount: onPageMount,
  body: m.Div({
    children: [
      HabitStatusEditModal({
        isOpen: isStatusEditorOpen,
        showTitleInHeader: true,
        habit: editableHabit,
        date: selectedDate,
        onClose: closeHabitEditor,
        onChange: onHabitStatusChange,
      }),
      m.If({
        subject: showSplashScreen,
        isTruthy: SplashScreen({ progress }),
        isFalsy: NavScaffold({
          cssClasses: "ph3 bg-white",
          route: "/",
          header: "Tasks in a day",
          content: m.Div(
            m.If({
              subject: noHabitsInStore,
              isTruthy: EmptyHomePageIllustration({}),
              isFalsy: m.Div({
                children: [
                  m.Div({
                    onmount: (el) => (el.scrollLeft = el.scrollWidth),
                    class: `sticky top-3 bg-white pb2 flex items-center justify-between z-999 w-100`,
                    children: m.For({
                      subject: sevenDays,
                      map: (date) => {
                        const isFuture = isFutureDay(date);
                        const isSelectedDay = areSameDates(
                          selectedDate.value,
                          date
                        );
                        const colorsCss = isSelectedDay
                          ? "black b b--silver"
                          : isFuture
                          ? "light-gray b--transparent"
                          : "light-silver pointer b--transparent";
                        const onDateSelect = () => {
                          if (isSelectedDay || isFuture) return;
                          selectedDate.value = date;
                        };

                        return m.Div({
                          class: `bw1 ba br-pill ph2 pv3 pb2 tc ${colorsCss}`,
                          onclick: handleTap(onDateSelect),
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
                    class: "mt2 mb2 f4 b",
                    children: readableDateLabel,
                  }),
                  m.Div({
                    class: "mb4 pb2 silver",
                    children: habitsStatusLabel,
                  }),
                  m.Div({
                    class: "mt4",
                    children: m.For({
                      subject: habits,
                      itemKey: "id",
                      n: Infinity,
                      nthChild: Link({
                        cssClasses: "flex pl5 pr3 nl3 mt4",
                        onClick: goToNewHabitsPage,
                        children: createNewHabitBtnLabel,
                      }),
                      map: (habit, habitIndex) => {
                        const { id, title, colorIndex, levels, tracker } =
                          trap(habit).props;
                        const statusLevelCode = derive(() => {
                          const status = getDayStatus(
                            tracker.value,
                            selectedDate.value
                          ) as DailyStatus;
                          return status.level.code;
                        });
                        const borderCss = op(statusLevelCode)
                          .isLT(1)
                          .ternary("b--light-silver", "b--transparent");

                        return m.Div({
                          class: "mt4 flex items-center",
                          children: [
                            ColorDot({
                              cssClasses: tmpl`pa3 mr3 ba b ${borderCss}`,
                              colorIndex: colorIndex,
                              level: statusLevelCode,
                              totalLevels: trap(levels).length,
                              icon: "check",
                              iconSize: 22,
                              showText: op(statusLevelCode).isGT(0).truthy,
                              showHeight: true,
                              onClick: () => openHabitEditor(habitIndex.value),
                            }),
                            m.Div({
                              class: "pointer",
                              onclick: handleTap(() => goToHabitPage(id.value)),
                              children: [
                                m.Div({
                                  class: "f5 fw6 f4-ns fw4-ns",
                                  children: title,
                                }),
                                m.Div({
                                  class: "f6 light-silver pt05",
                                  children: getHabitInfoLabel(id.value),
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
            })
          ),
          navbarTop: m.Div(
            m.If({
              subject: noHabitsInStore,
              isFalsy: AddHabitButton({}),
            })
          ),
        }),
      }),
    ],
  }),
});
