import { signal } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { Habit } from "../@common/types";
import {
  getHabitValidationError,
  getNewHabit,
  tryFetchingHabitUsingParams,
} from "../@common/utils";
import { HabitEditor } from "../@components";
import { Button, Page, Scaffold } from "../@elements";

type HabitEditorPageProps = {
  isNew: boolean;
};

export const HabitEditorPage = component<HabitEditorPageProps>(({ isNew }) => {
  const backDays = isNew.value ? 2 : 0;
  const error = signal("");
  const habit = signal<Habit>(getNewHabit(backDays));

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
      header: m.Div("New target habit"),
      content: m.Div([
        m.If({
          subject: error,
          isTruthy: m.Div({
            class: "red mb3",
            children: error,
          }),
        }),
        HabitEditor({
          habit: habit,
          isNew: isNew,
          onChange: (updatedHabit) => (habit.value = updatedHabit),
        }),
      ]),
      bottombar: m.Div({
        class: "w-100 pv3 flex items-center justify-between",
        children: [
          Button({
            className: "w-100 mr2",
            label: "Go back",
            onTap: () => history.back(),
          }),
          Button({
            className: "w-100 ml2",
            label: "Save",
            onTap: saveHabit,
          }),
        ],
      }),
    }),
  });
});
