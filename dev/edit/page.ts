import { derive, dobject, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import {
  BASE_COLORS,
  BASE_LEVELS,
  DAY_IN_MS,
  DAYS_OF_WEEK,
} from "../@common/constants";
import { DayFrequency, Habit } from "../@common/types";
import { getNewHabitId, getUrlParams } from "../@common/utils";
import {
  AddRemoveButton,
  Button,
  ColorDot,
  Page,
  Scaffold,
  TabBar,
  TextBox,
} from "../@elements";
import { Section } from "./@components";
import { fetchHabit } from "../@common/localstorage";

const backDays = 2;
const isNew = signal(true);
const error = signal("");
const habit = signal<Habit>({
  id: getNewHabitId() - DAY_IN_MS * backDays,
  title: "",
  frequency: [1, 1, 1, 1, 1, 1, 1],
  startAtDay0: 1,
  colorIndex: 0,
  levels: BASE_LEVELS,
  tracker: [],
  pauses: [],
  isStopped: false,
});

const { title, frequency, levels, colorIndex } = dobject(habit).props;
const everyDay = derive(() => frequency.value.every((day) => !!day));
const selectedCss = "bg-gray white";
const unSelectedCss = "bg-near-white light-silver";

const updateTitle = (title: string) => {
  habit.value = { ...habit.value, title };
};

const updateColor = (colorIndex: number) => {
  habit.value = { ...habit.value, colorIndex };
};

const updateFrequency = (dayIndex: number) => {
  if (dayIndex < -1 || dayIndex > 6) throw `Invalid day index`;

  if (dayIndex === -1) {
    habit.value = {
      ...habit.value,
      frequency: [1, 1, 1, 1, 1, 1, 1],
    };
    return;
  }

  const updatedFreq = everyDay.value
    ? (frequency.value.map((_) => 0) as DayFrequency)
    : frequency.value;
  updatedFreq[dayIndex] = everyDay.value ? 1 : updatedFreq[dayIndex] ? 0 : 1;
  habit.value = {
    ...habit.value,
    frequency: updatedFreq,
  };
};

const updateLevel = (levelText: string, levelIndex: number) => {
  const updatedLevels = levels.value;
  updatedLevels[levelIndex] = levelText;
  habit.value = {
    ...habit.value,
    levels: updatedLevels,
  };
};
const addOrRemoveLevel = (index: number, isAdd = true) => {
  const updatedLevels = levels.value;
  if (isAdd) updatedLevels.splice(index, 0, "");
  else updatedLevels.splice(index, 1);
  habit.value = {
    ...habit.value,
    levels: updatedLevels,
  };
};
const addLevel = (atIndex: number) => addOrRemoveLevel(atIndex);
const removeLevel = (fromIndex: number) => {
  if (levels.value.length < 3) return;
  addOrRemoveLevel(fromIndex, false);
};

const validateHabit = () => {
  if (!title.value) {
    error.value = "Title should not be empty";
    return;
  }
  if (frequency.value.every((day) => !day)) {
    error.value = "Select at least one day in a week";
    return;
  }
  if (!levels.value.every((level) => !!level)) {
    error.value = "One of the levels is empty";
    return;
  }

  error.value = "";
};
const saveHabit = () => {
  validateHabit();
  if (error.value) return;

  const habitID = `h.${habit.value.id}`;

  const habitJSON = JSON.stringify({
    ...habit.value,
    tracker: [...Array(backDays).keys()].map((i) =>
      Math.trunc(Math.random() * habit.value.levels.length)
    ),
  });
  localStorage.setItem(habitID, habitJSON);

  location.href = "/";
};

export default Page({
  onMount: () => {
    const params = getUrlParams();
    if (!params.length) return;

    for (let param of params) {
      if (!param.startsWith("habit-id=")) continue;
      const habitID = `h.${param.split("habit-id=")[1]}`;
      try {
        habit.value = fetchHabit(habitID);
        isNew.value = false;
      } catch (errMsg) {
        error.value = errMsg.toString();
      }
      break;
    }
  },
  body: Scaffold({
    classNames: "bg-white ph3",
    header: m.Div({
      children: dstring`${() =>
        !isNew.value && title.value
          ? `Edit '${title.value}'`
          : "New target habit"}`,
    }),
    content: m.Div([
      m.If({
        subject: error,
        isTruthy: m.Div({
          class: "red mb3",
          children: error,
        }),
      }),
      Section({
        title: "Title",
        child: TextBox({
          classNames: "ba bw1 b--light-gray br3 pa2 w-100",
          placeholder: "",
          text: title,
          onchange: updateTitle,
        }),
      }),
      Section({
        title: "Color",
        child: m.Div({
          class: "mb1 flex items-center flex-wrap",
          children: m.For({
            subject: BASE_COLORS,
            map: (colorOption, i) => {
              const borderColorCss = derive(() =>
                i === colorIndex.value ? "#999" : "#f4f4f4"
              );

              return m.Span({
                class: `mb2 pa1 br-100 mr1 bw2 ba flex`,
                style: dstring`border-color: ${borderColorCss}`,
                onclick: () => updateColor(i),
                children: m.Span({
                  class: dstring`pa2 br-100`,
                  style: `background-color: ${colorOption}`,
                }),
              });
            },
          }),
        }),
      }),
      m.Div({
        children: m.If({
          subject: isNew,
          isFalsy: m.Div({
            class: "pb5",
            children: [
              Section({
                title: "Actions",
                child: m.Div({
                  children: [
                    m.A({
                      class: "db mb3",
                      href: "/",
                      children: "Pause this habit for a while",
                    }),
                    m.A({
                      class: "db mb3",
                      href: "/",
                      children: "Stop this habit permanently",
                    }),
                    m.A({
                      class: "db mb3",
                      href: "/",
                      children:
                        "Stop this habit and recreate a new one with updated schedule and levels",
                    }),
                    m.A({
                      class: "db mb3",
                      href: "/",
                      children:
                        "Connect this stopped habit with a related, newly created habit",
                    }),
                    m.A({
                      class: "db mb3",
                      href: "/",
                      children:
                        "Connect this new habit with a related, old stopped habit",
                    }),
                    m.A({
                      class: "db mb3 red",
                      href: "/",
                      children:
                        "Delete this habit permanently along with its data",
                    }),
                  ],
                }),
              }),
            ],
          }),
          isTruthy: m.Div([
            Section({
              title: "Frequency",
              child: m.Div({
                children: [
                  m.Div({
                    class: "mb3 f6 flex items-center flex-wrap",
                    children: m.For({
                      subject: DAYS_OF_WEEK,
                      n: 0,
                      nthChild: m.Span({
                        class: dstring`pointer br-pill pv1 ph2 mr2 ${() =>
                          everyDay.value ? selectedCss : unSelectedCss}`,
                        children: "Daily",
                        onclick: () => updateFrequency(-1),
                      }),
                      map: (day, dayIndex) => {
                        const colorCss = derive(() =>
                          frequency.value[dayIndex] && !everyDay.value
                            ? selectedCss
                            : unSelectedCss
                        );

                        return m.Span({
                          class: dstring`pointer br-100 pv1 ph2 mr2 ${colorCss}`,
                          children: day.charAt(0),
                          onclick: () => updateFrequency(dayIndex),
                        });
                      },
                    }),
                  }),
                  m.Div({
                    class: "flex items-center",
                    children: [
                      m.Span({
                        class: "f6 w-30 silver",
                        children: "Start from",
                      }),
                      TabBar({
                        classNames: "w-100",
                        tabs: ["Today", "Tomorrow"],
                        selectedTabIndex: 0,
                        onTabChange: function (tabIndex: number): void {
                          throw new Error("Function not implemented.");
                        },
                      }),
                    ],
                  }),
                ],
              }),
            }),
            Section({
              title: "Levels",
              child: m.Div({
                children: m.For({
                  subject: levels,
                  map: (level, i) =>
                    m.Div({
                      children: [
                        m.Div({
                          class: "flex items-center justify-between",
                          children: [
                            m.Div({
                              class: "flex items-center",
                              children: [
                                ColorDot({
                                  classNames: "pa2 mr2",
                                  colorIndex,
                                  level: i,
                                  totalLevels: levels.value.length,
                                }),
                                TextBox({
                                  classNames:
                                    "ba bw1 b--light-gray br3 pa2 w-100",
                                  placeholder: "",
                                  text: level,
                                  onchange: (text) => updateLevel(text, i),
                                }),
                              ],
                            }),
                            AddRemoveButton({
                              hideAdd: i >= levels.value.length - 1,
                              hideRemove:
                                i === 0 || i >= levels.value.length - 1,
                              onAdd: () => addLevel(i + 1),
                              onRemove: () => removeLevel(i),
                            }),
                          ],
                        }),
                        m.If({
                          subject: i < levels.value.length - 1,
                          isTruthy: m.Div({
                            class: "pa2 ml2 bl bw1 b--light-gray",
                          }),
                        }),
                      ],
                    }),
                }),
              }),
            }),
          ]),
        }),
      }),
      m.Div({
        class: "pa5",
      }),
    ]),
    bottombar: m.Div({
      class: "w-100 pv3 flex items-center justify-between",
      children: [
        Button({
          className: "w-100 mr2",
          label: "Go back",
          onTap: () => history.back(),
        }),
        Button({
          className: "w-100 ml2",
          label: "Save",
          onTap: saveHabit,
        }),
      ],
    }),
  }),
});
