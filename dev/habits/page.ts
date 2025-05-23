import { derive, dobject, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { HOMEPAGE_OVERVIEW_TABS, INITIAL_SETTINGS } from "../@common/constants";
import {
  fetchHabits,
  getHabitsPageSettings,
  intializeTrackerEmptyDays,
  updateHabitsPageSettings,
} from "../@common/localstorage";
import { checkNoHabitsInStore } from "../@common/localstorage/habits";
import { getSortedHabits } from "../@common/transforms";
import { HabitUI } from "../@common/types";
import { goToHabitPage } from "../@common/utils";
import {
  AddHabitButton,
  HabitCard,
  HTMLPage,
  NavScaffold,
  SortOptions,
} from "../@components";
import { TabBar } from "../@elements";

const noHabitsInStore = signal(false);
const pageSettings = signal(INITIAL_SETTINGS.habitsPage);
const totalOverviewMonths = derive(
  () => HOMEPAGE_OVERVIEW_TABS[pageSettings.value.tabIndex].months
);
const habits = signal<HabitUI[]>([]);
const sortedHabits = derive(() =>
  getSortedHabits(
    habits.value,
    pageSettings.value.sortOptionIndex,
    totalOverviewMonths.value
  )
);
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
  habits.value = fetchHabits();
  pageSettings.value = getHabitsPageSettings();
  noHabitsInStore.value = checkNoHabitsInStore();
};

const onPageMount = () => {
  intializeTrackerEmptyDays();
  triggerPageDataRefresh();
  window.addEventListener("pageshow", triggerPageDataRefresh);
};

export default HTMLPage({
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
    content: m.Div(
      m.If({
        subject: noHabitsInStore,
        isTruthy: m.Div({
          class: "flex flex-column items-center justify-around",
          children: [
            m.Img({
              class: "mt3 pt4",
              src: "/assets/images/empty.png",
              height: "200",
            }),
            m.Div("It's all empty here!"),
            AddHabitButton({
              classNames: "pt5",
              justifyClassNames: "justify-around",
              label: "Add your first habit",
            }),
          ],
        }),
        isFalsy: m.Div([
          TabBar({
            classNames: "nl1 f6",
            tabs: HOMEPAGE_OVERVIEW_TABS.map((ov) => ov.label),
            selectedTabIndex: dobject(pageSettings).prop("tabIndex"),
            onTabChange: onTabChange,
          }),
          m.Div(
            m.For({
              subject: sortedActiveHabits,
              itemKey: "id",
              n: 0,
              nthChild: m.Div({
                class: "silver f6 mt3 pt1 mb4",
                children: [
                  "ACTIVE HABITS",
                  m.If({
                    subject: derive(() => !!sortedActiveHabits.value.length),
                    isFalsy: m.Div({
                      class: "mt3",
                      children: "None",
                    }),
                  }),
                ],
              }),
              map: (activeHabit) =>
                HabitCard({
                  classNames: "mb4",
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
                class: "silver f6 mt5 mb2",
                children: [
                  "STOPPED HABITS",
                  m.If({
                    subject: derive(() => !!sortedStoppedHabits.value.length),
                    isFalsy: m.Div({
                      class: "mt3",
                      children: "None",
                    }),
                  }),
                ],
              }),
              map: (stoppedHabit) =>
                HabitCard({
                  classNames: "mb4",
                  habit: stoppedHabit,
                  months: totalOverviewMonths,
                  onClick: () => goToHabitPage(stoppedHabit.value.id),
                }),
            })
          ),
        ]),
      })
    ),
    navbarTop: m.Div(
      m.If({
        subject: noHabitsInStore,
        isFalsy: AddHabitButton({}),
      })
    ),
  }),
});
