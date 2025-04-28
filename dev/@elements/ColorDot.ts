import { derive, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { BASE_COLORS, GOLDEN_RATIO } from "../@common/constants";
import { vibrateOnTap } from "../@common/utils";

type ColorDotProps = {
  classNames?: string;
  colorIndex: number;
  level: number;
  totalLevels: number;
  textContent?: string;
  textColor?: string;
  showText?: boolean;
  onClick?: () => void;
};

export const ColorDot = component<ColorDotProps>(
  ({
    classNames,
    colorIndex,
    level,
    totalLevels,
    textContent,
    showText,
    onClick,
  }) => {
    const color = derive(() => BASE_COLORS[colorIndex.value]);
    const opacityHexNum = derive(() =>
      Math.trunc(
        Math.pow(level.value / (totalLevels.value - 1), GOLDEN_RATIO) * 255
      )
    );
    const opacityHex = derive(() => {
      const hex = opacityHexNum.value.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    });
    const bgColor = derive(() =>
      level.value < 0 || opacityHex.value === "0"
        ? "transparent"
        : `${color.value}${opacityHex.value}`
    );
    const fontColor = derive(() =>
      showText?.value
        ? level.value / (totalLevels.value - 1) > 0.5
          ? "white"
          : "black"
        : level.value < 0
        ? "lightgray"
        : "transparent"
    );

    return m.Span({
      class: dstring`br-100 relative ${() =>
        level.value < 0 ? "transparent" : "bg-near-white"} ${classNames}`,
      onclick: vibrateOnTap(() => onClick && level.value >= 0 && onClick()),
      children: [
        m.Span({
          class: dstring`flex items-center justify-around absolute absolute--fill br-100 pt05`,
          style: dstring`
            background-color: ${bgColor};
            color: ${fontColor};
          `,
          children: derive(() => textContent?.value || "·"),
        }),
      ],
    });
  }
);
