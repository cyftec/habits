import { derive, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { getDayStatus } from "../../@common/transforms";
import { HabitUI } from "../../@common/types";
import { vibrateOnTap } from "../../@common/utils";
import { Modal } from "../../@elements";

type HabitStatusEditModalProps = {
  isOpen: boolean;
  habit: HabitUI;
  date: Date;
  showTitleInHeader?: boolean;
  onClose?: () => void;
  onChange: (levelIndex: number) => void;
};

export const HabitStatusEditModal = component<HabitStatusEditModalProps>(
  ({ isOpen, habit, date, showTitleInHeader, onClose, onChange }) => {
    return Modal({
      classNames: "f5 normal ba bw0 outline-0",
      isOpen: isOpen,
      onTapOutside: onClose,
      content: m.Div({
        class: "mnw5",
        children: [
          m.Div({
            class: "f5 b tc pa3",
            children: dstring`Change status ${() =>
              showTitleInHeader?.value
                ? `of  '${habit.value.title}'`
                : `for ${date.value.toDateString()}`}`,
          }),
          m.Div({
            class: "f5 mb1",
            children: m.For({
              subject: derive(() => habit.value.levels || []),
              map: (level, levelIndex) => {
                const optionCSS = dstring`pointer flex items-center pv3 pa3 bt b--moon-gray ${() =>
                  getDayStatus(habit.value.tracker, date.value)?.level.code ===
                  levelIndex
                    ? "bg-near-white black"
                    : "gray"}`;

                return m.Div({
                  class: optionCSS,
                  onclick: vibrateOnTap(() => onChange(levelIndex)),
                  children: [m.Span(level.name)],
                });
              },
            }),
          }),
        ],
      }),
    });
  }
);
