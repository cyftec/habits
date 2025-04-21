import { derive, dobject, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { BASE_COLORS, BASE_LEVELS, DAYS_OF_WEEK } from "../@common/constants";
import { DayFrequency, Habit } from "../@common/types";
import { getNewHabitId } from "../@common/utils";
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

const error = signal("");
const habit = signal<Habit>({
  title: "",
  frequency: [1, 1, 1, 1, 1, 1, 1],
  startAtDay0: 1,
  colorIndex: 0,
  levels: BASE_LEVELS,
  tracker: [],
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

  const habitID = `h.${getNewHabitId()}`;
  const habitJSON = JSON.stringify(habit.value);
  localStorage.setItem(habitID, habitJSON);

  location.href = "/";
};

export default Page({
  onMount: () => {
    const params = location.href.split("?")[1].split("&");
    console.log(params);
  },
  body: Scaffold({
    classNames: "bg-white ph3",
    header: dstring`${() =>
      title.value ? `Edit habit '${title.value}'` : "New habit"}`,
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
                            classNames: "ba bw1 b--light-gray br3 pa2 w-100",
                            placeholder: "",
                            text: level,
                            onchange: (text) => updateLevel(text, i),
                          }),
                        ],
                      }),
                      AddRemoveButton({
                        onAdd: () => addLevel(i + 1),
                        onRemove: () => removeLevel(i),
                      }),
                    ],
                  }),
                  m.If({
                    subject: i < levels.value.length - 1,
                    isTruthy: m.Div({
                      class: "pa2 ml2 bl bw1 b--near-white",
                    }),
                  }),
                ],
              }),
          }),
        }),
      }),
      m.Div({
        class: "pa5",
      }),
    ]),
    bottombar: Button({
      className: "w-100 mb3",
      label: "Save",
      onTap: saveHabit,
    }),
  }),
});
