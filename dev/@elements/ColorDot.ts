import { derive, dobject, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { vibrateOnTap } from "../@common/utils";
import { getColorsForLevel } from "../@common/transforms";

type ColorDotProps = {
  classNames?: string;
  dotClassNames?: string;
  colorIndex: number;
  level: number;
  totalLevels: number;
  textContent?: string;
  textColor?: string;
  showText?: boolean;
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
    textContent,
    showText,
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
          children: text,
        }),
      ],
    });
  }
);
