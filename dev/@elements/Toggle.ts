import { tmpl, op } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleTap } from "../@common/utils";

type ToggleProps = {
  cssClasses?: string;
  isOn: boolean;
  onToggle?: () => void;
};

export const Toggle = component<ToggleProps>(
  ({ cssClasses, isOn, onToggle }) => {
    const leftCircleCss = op(isOn).ternary(
      "b--transparent",
      "b--moon-gray bg-moon-gray"
    );
    const rightCircleCss = op(isOn).ternary(
      "b--mid-gray bg-mid-gray",
      "b--transparent"
    );

    return m.Div({
      class: tmpl`flex items-center pointer noselect br-pill ba bw1dot5 b--mid-gray b--hover-black bg-white pa05 black ${cssClasses}`,
      onclick: handleTap(onToggle),
      children: [
        m.Div({
          class: tmpl`br-100 ba bw1 b--hover-black pa1 ${leftCircleCss}`,
        }),
        m.Div({ class: "pa05" }),
        m.Div({
          class: tmpl`br-100 ba bw1 b--hover-black pa1 ${rightCircleCss}`,
        }),
      ],
    });
  }
);
