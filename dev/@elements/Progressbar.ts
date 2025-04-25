import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type ProgressBarProps = {
  classNames?: string;
  progress: number;
};

export const ProgressBar = component<ProgressBarProps>(
  ({ progress, classNames }) => {
    const styleCSS = dstring`width: ${() =>
      progress.value < 0 ? 0 : progress.value > 100 ? 100 : progress.value}%;`;

    return m.Div({
      class: dstring`br-pill bg-moon-gray ${classNames}`,
      children: m.Div({
        class: "br-pill bg-app-theme-color pa1",
        style: styleCSS,
      }),
    });
  }
);
