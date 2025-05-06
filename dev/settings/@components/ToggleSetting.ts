import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { Toggle } from "../../@elements";

type ToggleSettingProps = {
  classNames?: string;
  label: string;
  isToggleOn: boolean;
  onToggle: () => void;
};

export const ToggleSetting = component<ToggleSettingProps>(
  ({ classNames, label, isToggleOn, onToggle }) => {
    return m.Div({
      class: dstring`flex items-center justify-between ${classNames}`,
      children: [
        m.Div(label),
        Toggle({
          classNames: "ml3",
          isOn: isToggleOn,
          onToggle: onToggle,
        }),
      ],
    });
  }
);
