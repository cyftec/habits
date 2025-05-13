import { derive, dobject, dstring, MaybeSignalObject } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleCTA } from "../@common/utils";
import { getColorsForLevel } from "../@common/transforms";
import { Icon } from "../@elements";

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
  showHeight?: boolean;
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
    showHeight,
    onClick,
  }) => {
    const outerBorder = derive(() => (isRectangular?.value ? "br0" : "br-100"));
    const outerBg = derive(() =>
      level.value < 0 ? "bg-transparent" : "bg-light-gray"
    );
    const { peakBackgroundColor, backgroundColor, fontColor, levelPercent } =
      dobject(
        derive(() =>
          getColorsForLevel(
            level.value,
            totalLevels.value,
            colorIndex.value,
            showText?.value
          )
        )
      ).props;
    const text = derive(() => textContent?.value || "·");
    const showIcon = derive(
      () => showHeight?.value && icon?.value && levelPercent.value > 99
    );

    const onTap = () => {
      if (onClick && level.value >= 0) onClick();
    };

    return m.Span({
      class: dstring`pointer relative overflow-hidden ${outerBorder} ${outerBg} ${classNames}`,
      onclick: handleCTA(onTap),
      children: m.If({
        subject: showHeight,
        isTruthy: m.Span({
          class: dstring`flex items-center justify-around absolute left-0 right-0 bottom-0 br0 ${dotClassNames}`,
          style: dstring`
            background-color: ${peakBackgroundColor};
            color: white;
            height: ${levelPercent}%;
          `,
          children: m.If({
            subject: showIcon,
            isTruthy: Icon({
              iconName: icon as MaybeSignalObject<string>,
              size: iconSize,
            }),
          }),
        }),
        isFalsy: m.Span({
          class: dstring`flex items-center justify-around absolute absolute--fill ${dotClassNames}`,
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
      }),
    });
  }
);
