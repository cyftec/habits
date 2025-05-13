import { derive, dobject, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleCTA } from "../@common/utils";

type ToggleProps = {
  classNames?: string;
  isOn: boolean;
  onToggle?: () => void;
};

export const Toggle = component<ToggleProps>(
  ({ classNames, isOn, onToggle }) => {
    const circles = derive(() => {
      const leftCircleCss = isOn?.value
        ? "b--transparent"
        : "b--moon-gray bg-moon-gray";
      const rightCircleCss = isOn?.value
        ? "b--mid-gray bg-mid-gray"
        : "b--transparent";

      return { leftCircleCss, rightCircleCss };
    });

    const { leftCircleCss, rightCircleCss } = dobject(circles).props;

    return m.Div({
      class: dstring`flex items-center pointer noselect br-pill ba bw1dot5 b--mid-gray b--hover-black bg-white pa05 black ${classNames}`,
      onclick: handleCTA(onToggle),
      children: [
        m.Div({
          class: dstring`br-100 ba bw1 b--hover-black pa1 ${leftCircleCss}`,
        }),
        m.Div({ class: "pa05" }),
        m.Div({
          class: dstring`br-100 ba bw1 b--hover-black pa1 ${rightCircleCss}`,
        }),
      ],
    });
  }
);
