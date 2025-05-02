import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  deleteHabitFromStore,
  softDeleteHabitInStore,
} from "../../@common/localstorage";
import { HabitUI } from "../../@common/types";
import { Button, Modal } from "../../@elements";

type HabitDeleteModalProps = {
  isOpen: boolean;
  habit: HabitUI;
  deletePermanently: boolean;
  onClose: () => void;
  onDone: () => void;
};

export const HabitDeleteModal = component<HabitDeleteModalProps>(
  ({ isOpen, habit, deletePermanently, onClose, onDone }) => {
    return Modal({
      classNames: "bn",
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
              All the data and the acheivements associated with this habit will be lost forever
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
                  if (deletePermanently.value)
                    deleteHabitFromStore(habit.value.id);
                  else softDeleteHabitInStore(habit.value.id);
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
