import { derive, dobject, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { getDayStatus } from "../../@common/transforms";
import { HabitUI } from "../../@common/types";
import { handleTap } from "../../@common/utils";
import { Modal } from "../../@elements";
import { ColorDot } from "../ColorDot";

type HabitStatusEditModalProps = {
  isOpen: boolean;
  habit: HabitUI;
  date: Date;
  showTitleInHeader?: boolean;
  onClose?: () => void;
  onChange: (levelCode: number) => void;
};

export const HabitStatusEditModal = component<HabitStatusEditModalProps>(
  ({ isOpen, habit, date, showTitleInHeader, onClose, onChange }) => {
    const { title, levels, tracker, colorIndex } = dobject(
      derive(() => habit.value)
    ).props;
    const header = derive(() =>
      showTitleInHeader?.value
        ? `Change status of  '${title.value}'`
        : `Change status for ${date.value.toDateString()}`
    );
    const reversedLevels = derive(() => levels.value.slice().reverse() || []);

    return Modal({
      classNames: "f5 normal ba bw0 outline-0",
      isOpen: isOpen,
      onTapOutside: onClose,
      content: m.Div({
        class: "mnw5",
        children: [
          m.Div({
            class: "f5 b tc pa3",
            children: header,
          }),
          m.Div({
            class: "f5 mb1",
            children: m.For({
              subject: reversedLevels,
              map: (level, levelIndex) => {
                const levelCode = levels.value.length - 1 - levelIndex;
                const optionCSS = dstring`pointer flex items-center pv3 pa3 bt b--moon-gray ${() =>
                  getDayStatus(tracker.value, date.value)?.level.code ===
                  levelCode
                    ? "bg-near-white black fw6"
                    : "gray fw5"}`;
                const borderCss =
                  levelCode < 1 ? "b--light-silver" : "b--transparent";

                return m.Div({
                  class: optionCSS,
                  onclick: handleTap(() => onChange(levelCode)),
                  children: [
                    ColorDot({
                      classNames: `pa1 mr3 ba b ${borderCss}`,
                      colorIndex: colorIndex,
                      level: levelCode,
                      totalLevels: levels.value.length,
                      isRectangular: true,
                    }),
                    m.Span(level.name),
                  ],
                });
              },
            }),
          }),
        ],
      }),
    });
  }
);
