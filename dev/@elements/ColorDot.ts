import { derive, dobject, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { getColorsForLevel, vibrateOnTap } from "../@common/utils";

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
    const colors = derive(() =>
      getColorsForLevel(
        level.value,
        totalLevels.value,
        colorIndex.value,
        showText?.value
      )
    );
    const { backgroundColor, fontColor } = dobject(colors).props;

    return m.Span({
      class: dstring`pointer relative ${() =>
        isRectangular?.value ? "br0" : "br-100"} ${() =>
        level.value < 0 ? "transparent" : "bg-light-gray"} ${classNames}`,
      onclick: vibrateOnTap(() => onClick && level.value >= 0 && onClick()),
      children: [
        m.Span({
          class: dstring`flex items-center justify-around absolute absolute--fill ${() =>
            isRectangular?.value ? "br0" : "br-100"} ${dotClassNames}`,
          style: dstring`
            background-color: ${backgroundColor};
            color: ${fontColor};
          `,
          children: derive(() => textContent?.value || "·"),
        }),
      ],
    });
  }
);
