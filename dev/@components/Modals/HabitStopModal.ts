import { component, m } from "@mufw/maya";
import { Button, Modal } from "../../@elements";
import { HabitUI } from "../../@common/types";
import { dstring } from "@cyftech/signal";

type HabitStopModalProps = {
  isOpen: boolean;
  habit: HabitUI;
  onClose: () => void;
  onDone: () => void;
};

export const HabitStopModal = component<HabitStopModalProps>(
  ({ isOpen, habit, onClose, onDone }) => {
    return Modal({
      classNames: "bn",
      isOpen: isOpen,
      onTapOutside: onClose,
      content: m.Div({
        class: "pa3 f5",
        children: [
          m.Div({
            class: "mb3 b f4",
            children: dstring`Stop '${() => habit.value.title}'?`,
          }),
          m.Div({
            class: "mb4",
            children: [
              `This action is not reversible. You will not be able to resume it again.`,
              m.Br({}),
              m.Br({}),
              `Are you sure, you want to STOP this habit permanently?`,
            ],
          }),
          m.Div({
            class: "flex items-center justify-between f6",
            children: [
              Button({
                classNames: "w-100 pv2 ph3 mr2",
                children: "No, go back",
                onTap: onClose,
              }),
              Button({
                classNames: "w-100 pv2 ph3 ml2 b",
                children: "Yes, stop this",
                onTap: onDone,
              }),
            ],
          }),
        ],
      }),
    });
  }
);
