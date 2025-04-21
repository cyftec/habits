import { derive, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { BASE_COLORS } from "../@common/constants";

type ColorDotProps = {
  classNames?: string;
  colorIndex: number;
  level: number;
  totalLevels: number;
};

export const ColorDot = component<ColorDotProps>(
  ({ classNames, colorIndex, level, totalLevels }) => {
    const color = derive(() => BASE_COLORS[colorIndex.value]);
    const opacityHex = derive(() =>
      Math.trunc(
        (level.value / (totalLevels.value - 1)) *
          (level.value / (totalLevels.value - 1)) *
          255
      ).toString(16)
    );
    const bgColor = derive(() =>
      level.value < 0 || opacityHex.value === "0"
        ? "transparent"
        : `${color.value}${opacityHex.value}`
    );
    const fontColor = derive(() =>
      level.value < 0 ? "lightgray" : `${bgColor.value}`
    );

    return m.Span({
      class: dstring`br-100 relative ${() =>
        level.value < 0 ? "transparent" : "bg-light-gray"} ${classNames}`,
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
