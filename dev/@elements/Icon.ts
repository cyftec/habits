import { component, m } from "@mufw/maya";
import { derive, dstring } from "@cyftech/signal";
import { handleCTA } from "../@common/utils";

type IconProps = {
  className?: string;
  size?: number;
  iconName: string;
  onClick?: () => void;
  title?: string;
};

export const Icon = component<IconProps>(
  ({ className, size, onClick, iconName, title }) => {
    const pointerCss = derive(() => (!!onClick ? "pointer" : ""));
    const fontSize = derive(() => size?.value || 16);

    return m.Span({
      class: dstring`material-symbols-outlined ${pointerCss} ${className}`,
      style: dstring`font-size: ${fontSize}px`,
      onclick: handleCTA(onClick),
      children: iconName,
      title: title,
    });
  }
);
