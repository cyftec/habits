import { component, m } from "@mufw/maya";
import { compute, derive, dstring } from "@cyftech/signal";
import { handleTap } from "../@common/utils";

type IconProps = {
  classNames?: string;
  size?: number;
  iconName: string;
  onClick?: () => void;
  title?: string;
};

export const Icon = component<IconProps>(
  ({ classNames, size, onClick, iconName, title }) => {
    const pointerCss = !!onClick ? "pointer" : "";
    const fontSize = compute(size).or(16);

    return m.Span({
      class: dstring`material-symbols-outlined ${pointerCss} ${classNames}`,
      style: dstring`font-size: ${fontSize}px`,
      onclick: handleTap(onClick),
      children: iconName,
      title: title,
    });
  }
);
