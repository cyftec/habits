import { component, m } from "@mufw/maya";
import { dstring } from "@cyftech/signal";
import { vibrateOnTap } from "../@common/utils";

type IconProps = {
  className?: string;
  size?: number;
  iconName: string;
  onClick?: () => void;
  title?: string;
};

export const Icon = component<IconProps>(
  ({ className, size, onClick, iconName, title }) =>
    m.Span({
      class: dstring`material-symbols-rounded ${() =>
        !!onClick ? "pointer" : ""} ${className}`,
      style: dstring`font-size: ${() => size?.value || "16"}px`,
      onclick: vibrateOnTap(onClick),
      children: iconName,
      title: title,
    })
);
