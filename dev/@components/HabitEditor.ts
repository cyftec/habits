import { derive, dobject, dstring, Signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { BASE_COLORS, DAYS_OF_WEEK } from "../@common/constants";
import { DayFrequency, Habit } from "../@common/types";
import { Section } from ".";
import { AddRemoveButton, ColorDot, TextBox } from "../@elements";

type HabitEditorProps = {
  classNames?: string;
  habit: Signal<Habit>;
  isNew: boolean;
  onChange: (updatedHabit: Habit) => void;
};

export const HabitEditor = component<HabitEditorProps>(
  ({ classNames, habit, isNew, onChange }) => {
    const { title, frequency, levels, colorIndex } = dobject(habit).props;
    const everyDay = derive(() => frequency.value.every((day) => !!day));
    const selectedCss = "bg-gray white";
    const unSelectedCss = "bg-near-white light-silver";

    const updateTitle = (title: string) => {
      onChange({ ...habit.value, title });
    };

    const updateColor = (colorIndex: number) => {
      onChange({ ...habit.value, colorIndex });
    };

    const updateFrequency = (dayIndex: number) => {
      if (dayIndex < -1 || dayIndex > 6) throw `Invalid day index`;

      if (dayIndex === -1) {
        onChange({ ...habit.value, frequency: [1, 1, 1, 1, 1, 1, 1] });
        return;
      }

      const updatedFreq = everyDay.value
        ? (frequency.value.map((_) => 0) as DayFrequency)
        : frequency.value;
      updatedFreq[dayIndex] = everyDay.value
        ? 1
        : updatedFreq[dayIndex]
        ? 0
        : 1;
      onChange({ ...habit.value, frequency: updatedFreq });
    };

    const updateLevel = (levelText: string, levelIndex: number) => {
      const updatedLevels = levels.value;
      updatedLevels[levelIndex] = levelText;
      onChange({ ...habit.value, levels: updatedLevels });
    };
    const addOrRemoveLevel = (index: number, isAdd = true) => {
      const updatedLevels = levels.value;
      if (isAdd) updatedLevels.splice(index, 0, "");
      else updatedLevels.splice(index, 1);
      onChange({ ...habit.value, levels: updatedLevels });
    };
    const addLevel = (atIndex: number) => addOrRemoveLevel(atIndex);
    const removeLevel = (fromIndex: number) => {
      if (levels.value.length < 3) return;
      addOrRemoveLevel(fromIndex, false);
    };

    return m.Div({
      class: classNames,
      children: [
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
            isTruthy: m.Div([
              Section({
                title: "Frequency",
                child: m.Div({
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
            isFalsy: m.Div({
              class: "pb5",
              children: [
                Section({
                  title: "Actions",
                  child: m.Div({
                    children: [
                      m.A({
                        class: "db mb3 f6 gray",
                        href: "/",
                        children: "Pause this habit for a while",
                      }),
                      m.A({
                        class: "db mb3 f6 gray",
                        href: "/",
                        children: "Stop this habit permanently",
                      }),
                      m.A({
                        class: "db mb3 f6 gray",
                        href: "/",
                        children:
                          "Stop this habit and recreate a new one with updated schedule and levels",
                      }),
                      m.A({
                        class: "db mb3 f6 gray",
                        href: "/",
                        children:
                          "Connect this stopped habit with a related, newly created habit",
                      }),
                      m.A({
                        class: "db mb3 f6 gray",
                        href: "/",
                        children:
                          "Connect this new habit with a related, old stopped habit",
                      }),
                      m.A({
                        class: "db mb3 f6 red",
                        href: "/",
                        children:
                          "Delete this habit permanently along with its data",
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      ],
    });
  }
);
