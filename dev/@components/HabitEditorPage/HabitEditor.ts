import { derive, dobject, dstring, signal, Signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { Section } from "..";
import { BASE_COLORS } from "../../@common/constants";
import {
  getAddRemoveButtonsVisibility,
  getDetailedMilestones,
  getMilestone,
  getWeekdayName,
  levelTextboxDisability,
} from "../../@common/transforms";
import { HabitUI, MilestonesData, WeekdayFrequency } from "../../@common/types";
import { vibrateOnTap } from "../../@common/utils";
import {
  AddRemoveButton,
  Button,
  ColorDot,
  Icon,
  NumberBox,
  TextBox,
} from "../../@elements";

type HabitEditorProps = {
  classNames?: string;
  editableHabit?: HabitUI;
  editedHabit: Signal<HabitUI>;
  onChange: (updatedHabit: HabitUI) => void;
};

export const HabitEditor = component<HabitEditorProps>(
  ({ classNames, editableHabit, editedHabit, onChange }) => {
    const moreDetails = signal(false);
    const { title, frequency, levels, milestones, colorIndex } =
      dobject(editedHabit).props;
    const everyDay = derive(() => frequency.value.every((day) => !!day));
    const selectedCss = "bg-mid-gray white";
    const unSelectedCss = "bg-near-white light-silver";

    const updateTitle = (title: string) => {
      onChange({ ...editedHabit.value, title });
    };

    const updateColor = (colorIndex: number) => {
      onChange({ ...editedHabit.value, colorIndex });
    };

    const updateFrequency = (dayIndex: number) => {
      if (dayIndex < -1 || dayIndex > 6) throw `Invalid day index`;

      if (dayIndex === -1) {
        onChange({ ...editedHabit.value, frequency: [1, 1, 1, 1, 1, 1, 1] });
        return;
      }

      const updatedFreq = everyDay.value
        ? (frequency.value.map((_) => 0) as WeekdayFrequency)
        : frequency.value;
      updatedFreq[dayIndex] = everyDay.value
        ? 1
        : updatedFreq[dayIndex]
        ? 0
        : 1;
      onChange({ ...editedHabit.value, frequency: updatedFreq });
    };

    const updateLevel = (levelText: string, levelIndex: number) => {
      const updatedLevels = levels.value;
      updatedLevels[levelIndex] = {
        ...updatedLevels[levelIndex],
        name: levelText,
      };
      onChange({ ...editedHabit.value, levels: updatedLevels });
    };

    const addLevel = (atIndex: number) => {
      const updatedLevels = levels.value;
      updatedLevels.splice(atIndex, 0, { name: "", code: atIndex });
      onChange({ ...editedHabit.value, levels: updatedLevels });
    };

    const removeLevel = (fromIndex: number) => {
      const updatedLevels = levels.value;
      if (updatedLevels.length < 3) return;
      updatedLevels.splice(fromIndex, 1);
      onChange({ ...editedHabit.value, levels: updatedLevels });
    };

    const updateMilestone = (value: number, index: number) => {
      if (index < 0 || index > 2)
        throw `Incorrect index of milestone passed. Milestone values should not be more than 3.`;
      const updatedMilestones: MilestonesData = [
        ...editedHabit.value.milestones,
      ];
      updatedMilestones[index] = value;
      onChange({ ...editedHabit.value, milestones: updatedMilestones });
    };

    return m.Div({
      class: classNames,
      children: [
        Section({
          title: "Color",
          child: m.Div({
            class: "mb1 flex items-center",
            children: m.For({
              subject: BASE_COLORS,
              map: (colorOption, i) => {
                const borderColorCss = derive(() =>
                  i === colorIndex.value ? "#999" : "#f4f4f4"
                );

                return m.Span({
                  class: `pointer mb2 mr3 pa1 br-100 bw2 ba flex`,
                  style: dstring`border-color: ${borderColorCss}`,
                  onclick: vibrateOnTap(() => updateColor(i)),
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
          classNames: "pb1",
          title: "Schedule",
          child: m.Div({
            class: "mb3 f6 flex items-center justify-between justify-start-ns",
            children: m.For({
              subject: Array(7).fill(0),
              n: 0,
              nthChild: m.Span({
                class: dstring`pointer flex items-center justify-center br-pill h2 ph2 mr3-ns ${() =>
                  everyDay.value ? selectedCss : unSelectedCss}`,
                children: "Daily",
                onclick: vibrateOnTap(() => updateFrequency(-1)),
              }),
              map: (_, dayIndex) => {
                const colorCss = derive(() =>
                  frequency.value[dayIndex] && !everyDay.value
                    ? selectedCss
                    : unSelectedCss
                );

                return m.Span({
                  class: dstring`pointer flex items-center justify-center br-100 h2 w2 mr3-ns ${colorCss}`,
                  children: getWeekdayName(dayIndex, 1),
                  onclick: vibrateOnTap(() => updateFrequency(dayIndex)),
                });
              },
            }),
          }),
        }),
        Section({
          classNames: "pb1",
          title: "Title",
          child: TextBox({
            classNames: "ba bw1 b--light-silver br3 pa2 w-100",
            placeholder: "title of editedHabit",
            text: title,
            onchange: updateTitle,
          }),
        }),
        m.If({
          subject: moreDetails,
          isTruthy: m.Div([
            Section({
              classNames: "pb3",
              title: "Levels",
              description: `
                  A habit can have more than 2 levels. Like the habit 'Drink 2 litres water'
                  should have three levels - '0 litre', '1 litre' and '2 litres' respectively.
                  You can add or remove level by clicking on + or - buttons. Click on textbox
                  for editing the level name.
                `,
              showDescription: true,
              child: m.Div({
                children: m.For({
                  subject: levels,
                  map: (currentLevel, i) => {
                    const oldLevels = editableHabit?.value?.levels || [];
                    const newLevels = levels.value;
                    const { hideAddButton, hideRemoveButton } =
                      getAddRemoveButtonsVisibility(oldLevels, newLevels, i);
                    const textboxDisabled = levelTextboxDisability(
                      oldLevels,
                      newLevels,
                      i
                    );

                    return m.Div({
                      children: [
                        m.Div({
                          class: "flex items-center justify-between",
                          children: [
                            m.Div({
                              class:
                                "flex items-center ba bw1 b--light-silver br3 w-70 w-80-ns",
                              children: [
                                ColorDot({
                                  classNames: "w1dot5 h2 br3 br--left ml1px",
                                  dotClassNames: "br3 br--left",
                                  colorIndex,
                                  level: i,
                                  isRectangular: true,
                                  totalLevels: levels.value.length,
                                }),
                                TextBox({
                                  classNames: "bn pa2 br3 w-100 outline-0",
                                  placeholder: `Level ${i}`,
                                  disabled: textboxDisabled,
                                  text: currentLevel.name,
                                  onchange: (text) => updateLevel(text, i),
                                }),
                              ],
                            }),
                            AddRemoveButton({
                              hideAdd: hideAddButton,
                              hideRemove: hideRemoveButton,
                              onAdd: () => addLevel(i + 1),
                              onRemove: () => removeLevel(i),
                            }),
                          ],
                        }),
                        m.If({
                          subject: i < levels.value.length - 1,
                          isTruthy: m.Div({
                            class: "pa2 ml2 pl1 bl bw1 b--light-gray",
                          }),
                        }),
                      ],
                    });
                  },
                }),
              }),
            }),
            Section({
              title: "Milestones",
              description: dstring`
                  Miltestones are something long-term. Let's say after a month or two, you followed
                  your habit for 67% of the times, then based on below table you reached the '${() =>
                    getMilestone(editedHabit.value.milestones, 67)
                      .label}' milestone. You can set your own milestone levels depending
                  on the difficulty level of the habit.
                `,
              showDescription: true,
              child: m.Div({
                children: m.For({
                  subject: derive(() =>
                    getDetailedMilestones(milestones.value)
                  ),
                  n: 0,
                  nthChild: m.Div({
                    class: "mb1 ph2 pv0 bn bw1 relative ts-white-1",
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
                              "w-100 bg-white bn bw1 ph2dot5 di f4 b light-silver pb3 nl1",
                            children: "100",
                          }),
                          m.Span({
                            class: "ph2 bg-white light-silver b pb3 mr1",
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
                                  "w-100 bg-white bn bw1 br3 pa2dot5 di f4 b light-silver mb1",
                                children: "00",
                              }),
                              isFalsy: NumberBox({
                                classNames:
                                  "w-100 ba bw1 b--light-silver br3 pa2dot5 di f5 b dark-gray",
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
          ]),
        }),
        Button({
          className: "pv2 ph3 flex items-center",
          onTap: () => (moreDetails.value = !moreDetails.value),
          children: [
            Icon({
              className: "mr1",
              // size: 20,
              iconName: derive(() => (moreDetails.value ? "remove" : "add")),
            }),
            derive(() => (moreDetails.value ? "Less" : "More")),
          ],
        }),
      ],
    });
  }
);
