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

    return m.Span({
      class: dstring`bg-light-gray br-100 relative ${classNames}`,
      children: [
        m.Span({
          class: "absolute absolute--fill br-100",
          style: dstring`background-color: ${color}${opacityHex};`,
        }),
      ],
    });
  }
);
