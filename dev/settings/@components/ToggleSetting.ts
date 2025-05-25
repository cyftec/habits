import { tmpl } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { Toggle } from "../../@elements";

type ToggleSettingProps = {
  cssClasses?: string;
  label: string;
  isToggleOn: boolean;
  onToggle: () => void;
};

export const ToggleSetting = component<ToggleSettingProps>(
  ({ cssClasses, label, isToggleOn, onToggle }) => {
    return m.Div({
      class: tmpl`flex items-center justify-between ${cssClasses}`,
      children: [
        m.Div(label),
        Toggle({
          cssClasses: "ml3",
          isOn: isToggleOn,
          onToggle: onToggle,
        }),
      ],
    });
  }
);
