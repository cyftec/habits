import { derive, dobject, dstring, MaybeSignalObject } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { vibrateOnTap } from "../@common/utils";
import { getColorsForLevel } from "../@common/transforms";
import { Icon } from "./Icon";

type ColorDotProps = {
  classNames?: string;
  dotClassNames?: string;
  colorIndex: number;
  level: number;
  totalLevels: number;
  textColor?: string;
  showText?: boolean;
  textContent?: string;
  icon?: string;
  iconSize?: number;
  isRectangular?: boolean;
  onClick?: () => void;
};

export const ColorDot = component<ColorDotProps>(
  ({
    classNames,
    dotClassNames,
    colorIndex,
    level,
    totalLevels,
    showText,
    textContent,
    icon,
    iconSize,
    isRectangular,
    onClick,
  }) => {
    const outerBorder = derive(() => (isRectangular?.value ? "br0" : "br-100"));
    const outerBg = derive(() =>
      level.value < 0 ? "bg-transparent" : "bg-light-gray"
    );
    const { backgroundColor, fontColor } = dobject(
      derive(() =>
        getColorsForLevel(
          level.value,
          totalLevels.value,
          colorIndex.value,
          showText?.value
        )
      )
    ).props;
    const innerBR = derive(() => (isRectangular?.value ? "br0" : "br-100"));
    const text = derive(() => textContent?.value || "·");

    const onTap = () => {
      if (onClick && level.value >= 0) onClick();
    };

    return m.Span({
      class: dstring`pointer relative ${outerBorder} ${outerBg} ${classNames}`,
      onclick: vibrateOnTap(onTap),
      children: [
        m.Span({
          class: dstring`flex items-center justify-around absolute absolute--fill ${innerBR} ${dotClassNames}`,
          style: dstring`
            background-color: ${backgroundColor};
            color: ${fontColor};
          `,
          children: m.If({
            subject: icon,
            isTruthy: Icon({
              iconName: icon as MaybeSignalObject<string>,
              size: iconSize,
            }),
            isFalsy: m.Span(text),
          }),
        }),
      ],
    });
  }
);
