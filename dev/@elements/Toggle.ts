import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleCTA } from "../@common/utils";

type ToggleProps = {
  classNames?: string;
  isOn: boolean;
  onToggle?: () => void;
};

export const Toggle = component<ToggleProps>(
  ({ classNames, isOn, onToggle }) => {
    return m.Div({
      class: dstring`flex items-center pointer noselect br-pill ba bw1dot5 b--mid-gray b--hover-black bg-white pa05 black ${classNames}`,
      onclick: handleCTA(onToggle),
      children: [
        m.Div({
          class: dstring`br-100 ba bw2 b--hover-black pa1 ${() =>
            isOn?.value ? "b--transparent" : "b--moon-gray"}`,
        }),
        m.Div({ class: "pa05" }),
        m.Div({
          class: dstring`br-100 ba bw2 b--hover-black pa1 ${() =>
            isOn?.value ? "b--mid-gray" : "b--transparent"}`,
        }),
      ],
    });
  }
);
