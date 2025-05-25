import { tmpl, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleTap } from "../@common/utils";

type IconProps = {
  cssClasses?: string;
  size?: number;
  iconName: string;
  onClick?: () => void;
  title?: string;
};

export const Icon = component<IconProps>(
  ({ cssClasses, size, onClick, iconName, title }) => {
    const pointerCss = !!onClick ? "pointer" : "";
    const fontSize = trap(size).or(16);

    return m.Span({
      class: tmpl`material-symbols-outlined ${pointerCss} ${cssClasses}`,
      style: tmpl`font-size: ${fontSize}px`,
      onclick: handleTap(onClick),
      children: iconName,
      title: title,
    });
  }
);
