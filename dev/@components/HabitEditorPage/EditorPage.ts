import { derive, dstring, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { GoBackButton, Section } from "..";
import { saveHabit, softDeleteHabit } from "../../@common/localstorage";
import { getHabitValidationError, getNewHabit } from "../../@common/transforms";
import { HabitUI, LevelUI } from "../../@common/types";
import { goToHabitsPage } from "../../@common/utils";
import { Button, Link, Modal, Page, Scaffold } from "../../@elements";
import { HabitEditor } from "./HabitEditor";

type HabitEditorPageProps = {
  editableHabit?: HabitUI;
  onMount?: () => void;
};

export const HabitEditorPage = component<HabitEditorPageProps>(
  ({ editableHabit, onMount }) => {
    const deleteActionModalOpen = signal(false);
    const stopActionModalOpen = signal(false);
    const error = signal("");
    const editedHabit = signal<HabitUI>(getNewHabit());
    const pageTitle = derive(() =>
      editableHabit?.value
        ? `Edit '${editableHabit.value.title}'`
        : "Add new habit"
    );

    const save = () => {
      error.value = getHabitValidationError(editedHabit.value);
      if (error.value) return;

      const newHabit = editedHabit.value;
      const oldLevels = [...(editableHabit?.value?.levels || [])];
      const oldLevelsExist = oldLevels.length;
      let updatedTracker = [...newHabit.tracker];

      const levelsLengthMismatch = !!(
        oldLevelsExist && oldLevels.length !== newHabit.levels.length
      );

      if (levelsLengthMismatch) {
        const updates: { indices: number[]; newLevel: LevelUI }[] = [];

        oldLevels.forEach((oldLevel) => {
          const newLevel = newHabit.levels.find(
            (l) => l.name === oldLevel.name
          );
          const oldLevelRemoved = !newLevel;
          // the status for the day in old tracker should remain the same
          if (oldLevelRemoved) return;
          const levelPositionChanged = newLevel.code !== oldLevel.code;
          if (!levelPositionChanged) return;

          const indices: number[] = [];
          newHabit.tracker.forEach((status, i) => {
            if (status.level.code === oldLevel.code) indices.push(i);
          });
          updates.push({
            indices: indices,
            newLevel: newLevel,
          });
        });

        updates.forEach((update) => {
          update.indices.forEach((index) => {
            updatedTracker[index] = {
              ...updatedTracker[index],
              level: update.newLevel,
            };
          });
        });
      }
      saveHabit({ ...editedHabit.value, tracker: updatedTracker });
      history.back();
    };

    const onPageMount = () => {
      if (onMount) {
        onMount();
        // After onMount in parent, 'editableHabit' gets loaded
        editedHabit.value = editableHabit?.value as HabitUI;
      }
    };

    return Page({
      onMount: onPageMount,
      body: Scaffold({
        classNames: "bg-white ph3",
        header: m.Div({
          class: dstring`${() =>
            pageTitle.value.length > 22 ? "f2dot66" : ""}`,
          children: pageTitle,
        }),
        content: m.Div([
          m.If({
            subject: editableHabit,
            isTruthy: m.Div({
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
                        onTapOutside: () =>
                          (deleteActionModalOpen.value = false),
                        content: m.Div({
                          class: "pa3 f5",
                          children: [
                            m.Div({
                              class: "mb3 b f4",
                              children: dstring`Delete '${() =>
                                editedHabit.value.title}'?`,
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
                                    softDeleteHabit(editedHabit.value.id);
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
                                editedHabit.value.title}'?`,
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
                                    editedHabit.value = {
                                      ...editedHabit.value,
                                      isStopped: true,
                                    };
                                    save();
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
            editableHabit: editableHabit,
            editedHabit: editedHabit,
            onChange: (updatedHabit) => (editedHabit.value = updatedHabit),
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
                GoBackButton({
                  classNames: "w4dot50 w4dot25-ns",
                }),
                Button({
                  className: "w-100 pa3 ml3 b",
                  children: derive(() =>
                    editableHabit?.value ? "Update" : "Add"
                  ),
                  onTap: save,
                }),
              ],
            }),
          ],
        }),
      }),
    });
  }
);
