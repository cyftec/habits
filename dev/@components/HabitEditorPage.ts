import { derive, dstring, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  deleteHabitFromStore,
  saveHabitInStore,
  tryFetchingHabitUsingParams,
} from "../@common/localstorage";
import { Habit, StoreHabitID } from "../@common/types";
import {
  getHabitValidationError,
  getNewHabit,
  goToHabitPage,
  goToHabitsPage,
} from "../@common/utils";
import { HabitEditor, Section } from "../@components";
import { Button, Icon, Link, Modal, Page, Scaffold } from "../@elements";

type HabitEditorPageProps = {
  isNew: boolean;
};

export const HabitEditorPage = component<HabitEditorPageProps>(({ isNew }) => {
  const deleteActionModalOpen = signal(false);
  const stopActionModalOpen = signal(false);
  const error = signal("");
  const habit = signal<Habit>(getNewHabit());
  const initialLevels = signal<string[]>([]);
  const pageTitle = derive(() =>
    isNew.value ? "Add new habit" : `Edit '${habit.value.title}'`
  );

  const saveHabit = () => {
    error.value = getHabitValidationError(habit.value);
    if (error.value) return;

    const finalHabit = habit.value;
    const oldLevels = [...initialLevels.value];
    let updatedTracker = [...finalHabit.tracker];

    const levelsLengthMismatch = !!(
      !isNew.value &&
      oldLevels.length &&
      oldLevels.length !== finalHabit.levels.length
    );
    const levelsRemoved = finalHabit.levels.length < oldLevels.length;

    if (levelsLengthMismatch) {
      const updates: { indices: number[]; newValue: number }[] = [];

      if (!levelsRemoved) {
        oldLevels.forEach((oldLevelName, oldLevel) => {
          const newLevel = finalHabit.levels.indexOf(oldLevelName);
          const levelPositionChanged = newLevel > -1 && newLevel !== oldLevel;
          if (levelPositionChanged) {
            const indices: number[] = [];
            finalHabit.tracker.forEach((lvl, i) => {
              if (lvl === oldLevel) indices.push(i);
            });
            updates.push({
              indices: indices,
              newValue: newLevel,
            });
          }
        });
      } else {
        // UI only permits one level removal at a time
        let removedLevel = -1;
        for (let i = 0; i < oldLevels.length; i++) {
          if (oldLevels[i] !== finalHabit.levels[i]) {
            removedLevel = i;
            break;
          }
        }
        if (removedLevel >= 0) {
          oldLevels.forEach((oldLevelName, oldLevel) => {
            if (oldLevel <= removedLevel) return;

            const indices: number[] = [];
            finalHabit.tracker.forEach((lvl, i) => {
              if (lvl === oldLevel) indices.push(i);
            });
            updates.push({
              indices: indices,
              newValue: oldLevel - 1,
            });
          });
        }
      }

      updates.forEach((update) => {
        update.indices.forEach((index) => {
          updatedTracker[index] = update.newValue;
        });
      });
    }
    saveHabitInStore({ ...habit.value, tracker: updatedTracker });
    goBack();
  };

  const goBack = () => {
    isNew.value ? goToHabitsPage() : goToHabitPage(habit.value.id);
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
    if (!isNew.value) initialLevels.value = fetchedHabit.levels;
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
          subject: isNew,
          isFalsy: m.Div({
            class: "",
            children: [
              Section({
                classNames: "pb2",
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
                                  deleteHabitFromStore(habit.value.id);
                                  deleteActionModalOpen.value = false;
                                  goToHabitsPage();
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
                        "Stop this habit permanently and keep it for future",
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
          initialLevels: initialLevels,
          onChange: (updatedHabit) => (habit.value = updatedHabit),
        }),
      ]),
      bottombar: m.Div({
        class: "bg-white w-100 pv3",
        children: [
          m.If({
            subject: error,
            isTruthy: m.Div({
              class: "red mb3",
              children: error,
            }),
          }),
          m.Div({
            class: "flex items-center justify-stretch",
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
                onTap: goBack,
              }),
              Button({
                className: "w-100 pa3 ml3 b",
                children: derive(() => (isNew.value ? "Add" : "Update")),
                onTap: saveHabit,
              }),
            ],
          }),
        ],
      }),
    }),
  });
});
