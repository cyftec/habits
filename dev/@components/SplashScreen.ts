import { component, m } from "@mufw/maya";
import { ProgressBar } from "../@elements";
import { dstring } from "@cyftech/signal";

type SplashScreenProps = {
  classNames?: string;
  progress: number;
};

export const SplashScreen = component<SplashScreenProps>(
  ({ classNames, progress }) => {
    return m.Div({
      class: dstring`flex flex-column justify-center items-center vh-100 ${classNames}`,
      children: [
        m.Img({
          class: "mt6 br4",
          src: "/assets/images/habits-logo.png",
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
    });
  }
);
