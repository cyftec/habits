import { compute, tmpl, MaybeSignalObject, trap, op } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { getColorsForLevel } from "../@common/transforms";
import { handleTap } from "../@common/utils";
import { Icon } from "../@elements";

type ColorDotProps = {
  cssClasses?: string;
  dotCssClasses?: string;
  colorIndex: number;
  level: number;
  totalLevels: number;
  textColor?: string;
  showText?: boolean;
  textContent?: string;
  icon?: string;
  iconSize?: number;
  isRectangular?: boolean;
  showHeight?: boolean;
  onClick?: () => void;
};

export const ColorDot = component<ColorDotProps>(
  ({
    cssClasses,
    dotCssClasses,
    colorIndex,
    level,
    totalLevels,
    showText,
    textContent,
    icon,
    iconSize,
    isRectangular,
    showHeight,
    onClick,
  }) => {
    const outerBorder = op(isRectangular).ternary("br0", "br-100");
    const outerBg = op(level)
      .isLT(0)
      .ternary("bg-transparent", "bg-light-gray");
    const { peakBackgroundColor, backgroundColor, fontColor, levelPercent } =
      trap(
        compute(getColorsForLevel, level, totalLevels, colorIndex, showText)
      ).props;
    const text = trap(textContent).or("·");
    const showIcon = op(showHeight)
      .and(icon)
      .andThisIsGT(levelPercent, 99).truthy;

    const onTap = () => {
      if (onClick && level.value >= 0) onClick();
    };

    return m.Span({
      class: tmpl`pointer relative overflow-hidden ${outerBorder} ${outerBg} ${cssClasses}`,
      onclick: handleTap(onTap),
      children: m.If({
        subject: showHeight,
        isTruthy: m.Span({
          class: tmpl`flex items-center justify-around absolute left-0 right-0 bottom-0 br0 ${dotCssClasses}`,
          style: tmpl`
            background-color: ${peakBackgroundColor};
            color: white;
            height: ${levelPercent}%;`,
          children: m.If({
            subject: showIcon,
            isTruthy: Icon({
              iconName: icon as MaybeSignalObject<string>,
              size: iconSize,
            }),
          }),
        }),
        isFalsy: m.Span({
          class: tmpl`flex items-center justify-around absolute absolute--fill ${dotCssClasses}`,
          style: tmpl`
            background-color: ${backgroundColor};
            color: ${fontColor};`,
          children: m.If({
            subject: icon,
            isTruthy: Icon({
              iconName: icon as MaybeSignalObject<string>,
              size: iconSize,
            }),
            isFalsy: m.Span(text),
          }),
        }),
      }),
    });
  }
);
