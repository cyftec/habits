import { derive, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { Habit } from "../@common/types";
import { Button, Page, Scaffold } from "../@elements";
import { getUrlParams } from "../@common/utils";
import { fetchHabit } from "../@common/localstorage";

const error = signal("");
const habit = signal<Habit | undefined>(undefined);

export default Page({
  onMount: () => {
    const params = getUrlParams();
    if (!params.length) return;

    for (let param of params) {
      if (!param.startsWith("id=")) continue;
      const habitID = `h.${param.split("id=")[1]}`;
      try {
        habit.value = fetchHabit(habitID);
      } catch (errMsg) {
        error.value = errMsg.toString();
      }
      break;
    }
  },
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
            if (habit.value)
              location.href = `/edit/?habit-id=${habit.value?.id}`;
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
