import { tmpl } from "@cyftech/signal";
import { Children, component, m } from "@mufw/maya";
import { handleTap } from "../@common/utils";

type ButtonProps = {
  cssClasses?: string;
  onTap: () => void;
  children: Children;
};

export const Button = component<ButtonProps>(
  ({ cssClasses, onTap, children }) =>
    m.Button({
      class: tmpl`pointer noselect br-pill ba bw1 b--light-silver b--hover-black bg-white black ${cssClasses}`,
      onclick: handleTap(() => onTap()),
      children: children,
    })
);
