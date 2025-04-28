import { derive, dstring, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { tryFetchingHabitUsingParams } from "../@common/localstorage";
import { Habit } from "../@common/types";
import { getHabitValidationError, getNewHabit } from "../@common/utils";
import { HabitEditor, Section } from "../@components";
import { Button, Icon, Link, Modal, Page, Scaffold } from "../@elements";

type HabitEditorPageProps = {
  isNew: boolean;
};

export const HabitEditorPage = component<HabitEditorPageProps>(({ isNew }) => {
  const backDays = isNew.value ? 10 : 0;
  const deleteActionModalOpen = signal(false);
  const stopActionModalOpen = signal(false);
  const error = signal("");
  const habit = signal<Habit>(getNewHabit(backDays));
  const pageTitle = derive(() =>
    isNew.value ? "New target habit" : `Edit '${habit.value.title}'`
  );

  const saveHabit = () => {
    error.value = getHabitValidationError(habit.value);
    if (error.value) return;

    const habitID = `h.${habit.value.id}`;
    const tracker = isNew.value
      ? [...Array(backDays).keys()].map((i) =>
          Math.trunc(Math.random() * habit.value.levels.length)
        )
      : habit.value.tracker;
    const habitJSON = JSON.stringify({ ...habit.value, tracker });
    localStorage.setItem(habitID, habitJSON);
    history.back();
  };

  const onPageMount = () => {
    if (isNew.value) return;

    const [fetchedHabit, err] = tryFetchingHabitUsingParams();
    if (err || !fetchedHabit) {
      error.value =
        err || "Error fetching habit from 'id' given in query params";
      return;
    }
    habit.value = fetchedHabit;
  };

  return Page({
    onMount: onPageMount,
    body: Scaffold({
      classNames: "bg-white ph3",
      header: m.Div({
        class: dstring`${() => (pageTitle.value.length > 22 ? "f2dot66" : "")}`,
        children: pageTitle,
      }),
      content: m.Div([
        m.If({
          subject: error,
          isTruthy: m.Div({
            class: "red mb3",
            children: error,
          }),
        }),
        m.If({
          subject: isNew,
          isFalsy: m.Div({
            class: "",
            children: [
              Section({
                title: "Actions",
                child: m.Div({
                  children: [
                    Modal({
                      classNames: "bn",
                      isOpen: deleteActionModalOpen,
                      onTapOutside: () => (deleteActionModalOpen.value = false),
                      content: m.Div({
                        class: "pa3 f5",
                        children: [
                          m.Div({
                            class: "mb3 b f4",
                            children: dstring`Delete '${() =>
                              habit.value.title}'?`,
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
                                onTap: () =>
                                  (deleteActionModalOpen.value = false),
                              }),
                              Button({
                                className: "pv2 ph3 ml2 b red",
                                children: "Yes, delete permanently",
                                onTap: () => {
                                  const habitID = `h.${habit.value.id}`;
                                  localStorage.removeItem(habitID);
                                  deleteActionModalOpen.value = false;
                                  location.href = "/habits/";
                                },
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                    Link({
                      classNames: "db mb3 f6 red",
                      children:
                        "Delete this habit permanently along with its data",
                      onClick: () => (deleteActionModalOpen.value = true),
                    }),
                    Modal({
                      classNames: "bn",
                      isOpen: stopActionModalOpen,
                      onTapOutside: () => (stopActionModalOpen.value = false),
                      content: m.Div({
                        class: "pa3 f5",
                        children: [
                          m.Div({
                            class: "mb3 b f4",
                            children: dstring`Stop '${() =>
                              habit.value.title}'?`,
                          }),
                          m.Div({
                            class: "mb4",
                            children: [
                              `
                              This action is not reversible. You will not be able to resume it again.`,
                              // USE BELOW LINE WHEN HABIT PAUSE ACTION IS IMPLEMENTED
                              // `
                              // This action is not reversible. You will not be able to resume it again.
                              // If you're unsure about resuming it later, you can close this dialog and
                              // trying pausing this habit with the other link.`,
                              m.Br({}),
                              m.Br({}),
                              `
                              Are you sure, you want to STOP this habit permanently?
                              `,
                            ],
                          }),
                          m.Div({
                            class: "flex items-center justify-between f6",
                            children: [
                              Button({
                                className: "w-100 pv2 ph3 mr2",
                                children: "No, go back",
                                onTap: () =>
                                  (stopActionModalOpen.value = false),
                              }),
                              Button({
                                className: "w-100 pv2 ph3 ml2 b",
                                children: "Yes, stop this",
                                onTap: () => {
                                  // const habitID = `h.${habit.value.id}`;
                                  habit.value = {
                                    ...habit.value,
                                    isStopped: true,
                                  };
                                  saveHabit();
                                  stopActionModalOpen.value = false;
                                },
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                    Link({
                      classNames: "db mb3 f6 gray",
                      children:
                        "Stop this habit permanently and keep it for review in future",
                      onClick: () => (stopActionModalOpen.value = true),
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
        HabitEditor({
          habit: habit,
          onChange: (updatedHabit) => (habit.value = updatedHabit),
        }),
        m.If({
          subject: error,
          isTruthy: m.Div({
            class: "red mb3",
            children: error,
          }),
        }),
      ]),
      bottombar: m.Div({
        class: "bg-white w-100 pv3 flex items-center justify-stretch",
        children: [
          Button({
            className: "w4dot50 w4dot25-ns pa3 flex items-center",
            children: [
              Icon({ iconName: "arrow_back" }),
              m.Span({
                class: "ml1",
                children: `Go Back`,
              }),
            ],
            onTap: () => history.back(),
          }),
          Button({
            className: "w-100 pa3 ml3 b",
            children: derive(() => (isNew.value ? "Save" : "Update")),
            onTap: saveHabit,
          }),
        ],
      }),
    }),
  });
});
