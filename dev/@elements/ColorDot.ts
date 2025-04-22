import { derive, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { BASE_COLORS, GOLDEN_RATIO } from "../@common/constants";

type ColorDotProps = {
  classNames?: string;
  colorIndex: number;
  level: number;
  totalLevels: number;
};

export const ColorDot = component<ColorDotProps>(
  ({ classNames, colorIndex, level, totalLevels }) => {
    const color = derive(() => BASE_COLORS[colorIndex.value]);
    const opacityHex = derive(() => {
      const hex = Math.trunc(
        Math.pow(level.value / (totalLevels.value - 1), GOLDEN_RATIO) * 255
      ).toString(16);

      return hex.length === 1 ? `0${hex}` : hex;
    });
    const bgColor = derive(() =>
      level.value < 0 || opacityHex.value === "0"
        ? "transparent"
        : `${color.value}${opacityHex.value}`
    );
    const fontColor = derive(() =>
      level.value < 0 ? "lightgray" : "transparent"
    );

    return m.Span({
      class: dstring`br-100 relative ${() =>
        level.value < 0 ? "transparent" : "bg-near-white"} ${classNames}`,
      children: [
        m.Span({
          class: dstring`flex items-center justify-around absolute absolute--fill br-100 pt05`,
          style: dstring`
            background-color: ${bgColor};
            color: ${fontColor};
          `,
          children: "·",
        }),
      ],
    });
  }
);
