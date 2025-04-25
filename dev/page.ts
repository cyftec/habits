import { m } from "@mufw/maya";
import { Page, ProgressBar, Scaffold } from "./@elements";
import { signal } from "@cyftech/signal";

const progress = signal(0);
const transitionToHabitsPage = () => {
  const tickerID = setInterval(() => {
    progress.value += 1;
    if (progress.value >= 100) {
      clearInterval(tickerID);
      location.href = "/habits/";
    }
  }, 15);
};

export default Page({
  classNames: "bg-near-white",
  onMount: transitionToHabitsPage,
  body: Scaffold({
    classNames: "bg-near-white ph3",
    content: m.Div({
      class: "flex flex-column justify-center items-center vh-100",
      children: [
        m.Img({
          class: "mt6 br4",
          src: "/assets/habits-logo.png",
          height: "100",
          width: "100",
        }),
        m.Div({
          class: "f3 b mv3",
          children: "Habits",
        }),
        ProgressBar({
          classNames: "w-40",
          progress: progress,
        }),
        m.Div({
          class: "mt7 pv4",
          children: "A Cyfer Product",
        }),
      ],
    }),
  }),
});
