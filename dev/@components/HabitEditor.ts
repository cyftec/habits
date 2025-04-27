import { derive, dobject, dstring, effect, Signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { BASE_COLORS, DAYS_OF_WEEK } from "../@common/constants";
import { DayFrequency, Habit, MilestonesData } from "../@common/types";
import { Section } from ".";
import {
  AddRemoveButton,
  ColorDot,
  Icon,
  NumberBox,
  TextBox,
} from "../@elements";
import { getDetailedMilestones } from "../@common/utils";

type HabitEditorProps = {
  classNames?: string;
  habit: Signal<Habit>;
  onChange: (updatedHabit: Habit) => void;
};

export const HabitEditor = component<HabitEditorProps>(
  ({ classNames, habit, onChange }) => {
    const { title, frequency, levels, milestones, colorIndex } =
      dobject(habit).props;
    const everyDay = derive(() => frequency.value.every((day) => !!day));
    const selectedCss = "bg-mid-gray white";
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

    const updateMilestone = (value: number, index: number) => {
      if (index < 0 || index > 2)
        throw `Incorrect index of milestone passed. Milestone values should not be more than 3.`;
      const updatedMilestones: MilestonesData = [...habit.value.milestones];
      updatedMilestones[index] = value;
      onChange({ ...habit.value, milestones: updatedMilestones });
    };

    return m.Div({
      class: classNames,
      children: [
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
          title: "Title",
          child: TextBox({
            classNames: "ba bw1 b--light-gray br3 pa2 w-100",
            placeholder: "",
            text: title,
            onchange: updateTitle,
          }),
        }),
        Section({
          title: "Frequency",
          child: m.Div({
            class: "mb3 f6 flex items-center flex-wrap",
            children: m.For({
              subject: DAYS_OF_WEEK,
              n: 0,
              nthChild: m.Span({
                class: dstring`pointer flex items-center justify-center br-pill h2 ph2 mr2 ${() =>
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
                  class: dstring`pointer flex items-center justify-center br-100 h2 w2 mr2 ${colorCss}`,
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
                              classNames: "ba bw1 b--light-gray br3 pa2 w-100",
                              placeholder: "",
                              text: level,
                              onchange: (text) => updateLevel(text, i),
                            }),
                          ],
                        }),
                        AddRemoveButton({
                          hideAdd: i >= levels.value.length - 1,
                          hideRemove: i === 0 || i >= levels.value.length - 1,
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
        Section({
          title: "Milestones",
          child: m.Div({
            children: m.For({
              subject: derive(() => getDetailedMilestones(milestones.value)),
              n: 0,
              nthChild: m.Div({
                class:
                  "mb1 ph2 pv0 bn br3 bw1 b--light-gray relative ts-white-1",
                children: [
                  m.Span({
                    class: "lh-copy",
                    children: "",
                  }),
                  m.Span({
                    class:
                      "w-30 absolute mt3 right-2 bottom--1dot5 flex items-center z-1",
                    children: [
                      m.Span({
                        class:
                          "w-100 bg-white bn bw1 b--gray br3 pa2dot5 di f4 b light-silver mb1 nl1",
                        children: "100",
                      }),
                      m.Span({
                        class: "ph2 bg-white light-silver b mr1",
                        children: "%",
                      }),
                    ],
                  }),
                ],
              }),
              map: (milestone, i) =>
                m.Div({
                  class: "mb1 ph4 pv4 ba br3 bw1 b--light-gray relative",
                  children: [
                    m.Span({
                      class: "lh-copy flex items-center",
                      children: [
                        Icon({
                          className: `mr2 ${milestone.color}`,
                          size: 20,
                          iconName: milestone.icon,
                        }),
                        milestone.label,
                      ],
                    }),
                    m.Span({
                      class:
                        "w-30 absolute mt3 right-2 bottom--1dot5 flex items-center z-1",
                      children: [
                        m.If({
                          subject: i === 3,
                          isTruthy: m.Span({
                            class:
                              "w-100 bg-white bn bw1 b--gray br3 pa2dot5 di f4 b light-silver mb1",
                            children: "00",
                          }),
                          isFalsy: NumberBox({
                            classNames:
                              "w-100 ba bw1 b--gray br3 pa2dot5 di f5 b dark-gray",
                            num: milestone.percent,
                            onchange: (value) => updateMilestone(value, i),
                          }),
                        }),
                        m.Span({
                          class: "ph2 bg-white light-silver b",
                          children: "%",
                        }),
                      ],
                    }),
                  ],
                }),
            }),
          }),
        }),
      ],
    });
  }
);
