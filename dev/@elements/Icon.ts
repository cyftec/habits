import { component, m } from "@mufw/maya";
import { compute, derive, dstring } from "@cyftech/signal";
import { handleTap } from "../@common/utils";

type IconProps = {
  className?: string;
  size?: number;
  iconName: string;
  onClick?: () => void;
  title?: string;
};

export const Icon = component<IconProps>(
  ({ className, size, onClick, iconName, title }) => {
    const pointerCss = !!onClick ? "pointer" : "";
    const fontSize = compute(size).or(16);

    return m.Span({
      class: dstring`material-symbols-outlined ${pointerCss} ${className}`,
      style: dstring`font-size: ${fontSize}px`,
      onclick: handleTap(onClick),
      children: iconName,
      title: title,
    });
  }
);
