import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { deleteHabit } from "../../@common/localstorage";
import { HabitUI } from "../../@common/types";
import { Button, Modal } from "../../@elements";

type HabitDeleteModalProps = {
  isOpen: boolean;
  habit: HabitUI;
  onClose: () => void;
  onDone: () => void;
};

export const HabitDeleteModal = component<HabitDeleteModalProps>(
  ({ isOpen, habit, onClose, onDone }) => {
    return Modal({
      classNames: "bn w-30-ns",
      isOpen: isOpen,
      onTapOutside: onClose,
      content: m.Div({
        class: "pa3 f5",
        children: [
          m.Div({
            class: "mb3 b f4",
            children: dstring`Delete '${() => habit.value?.title}'?`,
          }),
          m.Div({
            class: "mb4",
            children: [
              `
              All the data and the achievements associated with this habit will be lost forever
              with this action, and cannot be reversed.
              `,
              m.Br({}),
              m.Br({}),
              `
              Are you sure, you want to DELETE this habit permanently?
              `,
            ],
          }),
          m.Div({
            class: "flex items-center justify-between f6",
            children: [
              Button({
                className: "w-25 pv2 ph3 mr1 b",
                children: "No",
                onTap: onClose,
              }),
              Button({
                className: "pv2 ph3 ml2 b red",
                children: "Yes, delete permanently",
                onTap: () => {
                  deleteHabit(habit.value.id);
                  onDone();
                },
              }),
            ],
          }),
        ],
      }),
    });
  }
);
