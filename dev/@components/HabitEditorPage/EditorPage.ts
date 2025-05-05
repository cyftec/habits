import { derive, dobject, dstring, effect, signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { GoBackButton, HabitDeleteModal, Section } from "..";
import {
  getEditPageSettings,
  saveHabit,
  stopHabit,
} from "../../@common/localstorage";
import {
  getHabitValidationError,
  getNewHabit,
  getTrackerForLevelsChange,
} from "../../@common/transforms";
import { HabitUI } from "../../@common/types";
import { Button, Link, Modal, Page, Scaffold } from "../../@elements";
import { HabitEditor } from "./HabitEditor";
import { INITIAL_SETTINGS } from "../../@common/constants";

type HabitEditorPageProps = {
  editableHabit?: HabitUI;
  onMount?: () => void;
};

export const HabitEditorPage = component<HabitEditorPageProps>(
  ({ editableHabit, onMount }) => {
    const editPageSettings = signal(INITIAL_SETTINGS.editPage);
    const deleteActionModalOpen = signal(false);
    const stopActionModalOpen = signal(false);
    const error = signal("");
    const editedHabit = signal<HabitUI>(getNewHabit());
    const pageTitle = derive(() =>
      editableHabit?.value
        ? `Edit '${editableHabit.value.title}'`
        : "Add new habit"
    );
    effect(() => console.log(editPageSettings.value.showHints));

    const openDeleteModal = () => (deleteActionModalOpen.value = true);
    const closeDeleteModal = () => (deleteActionModalOpen.value = false);
    const onHabitDelete = () => {
      closeDeleteModal();
      history.go(-2);
    };

    const save = () => {
      error.value = getHabitValidationError(
        editedHabit.value,
        !editableHabit?.value
      );
      if (error.value) return;

      const newHabit = editedHabit.value;
      const oldLevels = [...(editableHabit?.value?.levels || [])];
      const updatedTracker = getTrackerForLevelsChange(
        oldLevels,
        newHabit.levels,
        newHabit.tracker
      );
      saveHabit({ ...editedHabit.value, tracker: updatedTracker });
      history.back();
    };

    const onPageMount = () => {
      if (onMount) {
        onMount();
        // After onMount in parent, 'editableHabit' gets loaded
        editedHabit.value = editableHabit?.value as HabitUI;
      }
      editPageSettings.value = getEditPageSettings();
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
            isTruthy: m.Div([
              Section({
                classNames: "pb2",
                title: "Actions",
                children: [
                  HabitDeleteModal({
                    isOpen: deleteActionModalOpen,
                    habit: editedHabit,
                    onClose: closeDeleteModal,
                    onDone: onHabitDelete,
                  }),
                  Link({
                    classNames: "db mb3 f6 red",
                    children:
                      "Delete this habit permanently along with its data",
                    onClick: openDeleteModal,
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
                              onTap: () => (stopActionModalOpen.value = false),
                            }),
                            Button({
                              className: "w-100 pv2 ph3 ml2 b",
                              children: "Yes, stop this",
                              onTap: () => {
                                stopHabit(editedHabit.value.id);
                                stopActionModalOpen.value = false;
                                history.back();
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
            ]),
          }),
          HabitEditor({
            editableHabit: editableHabit,
            editedHabit: editedHabit,
            hideDescriptions: derive(() => !editPageSettings.value.showHints),
            showFullCustomisations: dobject(editPageSettings).prop(
              "showFullCustomisation"
            ),
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
