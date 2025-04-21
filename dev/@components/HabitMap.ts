import { component, m } from "@mufw/maya";
import { ColorDot } from "../@elements";
import { Month, MonthStatus } from "../@common/types";
import { derive, dstring } from "@cyftech/signal";

type MonthMapProps = {
  classNames?: string;
  status?: MonthStatus;
  month: Month;
  colorIndex: number;
};

export const MonthMap = component<MonthMapProps>(
  ({ classNames, status, month, colorIndex }) => {
    return m.Div({
      class: dstring`flex items-center ${classNames}`,
      children: [
        m.Div({
          class: "f8 b w1 gray",
          children: derive(() => month.value.charAt(0)),
        }),
        m.Div({
          class: "w-100 flex items-center justify-between",
          children: m.For({
            subject: status?.value || [
              0, 1, 1, -1, 0, 0, -1, 1, -1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0,
              1, 0, -1, 1, 1, 0, 1, -1, 0, 0, 1, 0,
            ],
            map: (level) =>
              ColorDot({
                classNames: "pa1",
                colorIndex: colorIndex,
                level: level,
                totalLevels: 2,
              }),
          }),
        }),
      ],
    });
  }
);
