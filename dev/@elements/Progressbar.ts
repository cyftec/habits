import { tmpl, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type ProgressBarProps = {
  cssClasses?: string;
  progress: number;
};

export const ProgressBar = component<ProgressBarProps>(
  ({ progress, cssClasses }) => {
    return m.Div({
      class: tmpl`br-pill bg-moon-gray ${cssClasses}`,
      children: m.Div({
        class: "br-pill bg-app-theme-color pa1",
        style: tmpl`width: ${trap(progress).toConfined(0, 100)}%;`,
      }),
    });
  }
);
