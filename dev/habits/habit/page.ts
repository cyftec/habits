import { derive, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { Habit } from "../../@common/types";
import { tryFetchingHabitUsingParams } from "../../@common/utils";
import { Button, Page, Scaffold } from "../../@elements";

const error = signal("");
const habit = signal<Habit | undefined>(undefined);

const onPageMount = () => {
  const [fetchedHabit, err] = tryFetchingHabitUsingParams();
  if (err || !fetchedHabit) {
    error.value = err || "Nohabit found for 'id' in query param";
    return;
  }
  habit.value = fetchedHabit;
};

export default Page({
  onMount: onPageMount,
  body: Scaffold({
    classNames: "bg-white ph3",
    header: m.Div({
      class: "flex items-start justify-between",
      children: [
        derive(() => (habit.value ? habit.value.title : "Loading..")),
        m.Span({
          class: "ml2 mt2 pa2 bg-near-white ba br3 b--light-silver f5",
          children: "&#128395;",
          onclick: () => {
            if (habit.value) location.href = `edit/?id=${habit.value?.id}`;
          },
        }),
      ],
    }),
    content: m.Div({
      children: [
        m.If({
          subject: error,
          isTruthy: m.Div({ class: "red", children: error }),
          isFalsy: m.Div(
            m.If({
              subject: habit,
              isFalsy: m.Div({ class: "", children: "habit.." }),
              isTruthy: m.Div(
                derive(() => `${new Date(habit.value?.id || 0)}`)
              ),
            })
          ),
        }),
      ],
    }),
    bottombar: Button({
      label: dstring`go back to home page`,
      onTap: () => (location.href = "/"),
    }),
  }),
});
