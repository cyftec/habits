import { component, m } from "@mufw/maya";
import { ColorDot } from "../@elements";
import { Month, MonthStatus } from "../@common/types";
import { derive, dstring } from "@cyftech/signal";

type MonthMapProps = {
  classNames?: string;
  status: MonthStatus;
  month: Month;
  colorIndex: number;
  totalLevels: number;
};

export const MonthMap = component<MonthMapProps>(
  ({ classNames, status, month, colorIndex, totalLevels }) => {
    return m.Div({
      class: dstring`flex items-center ${classNames}`,
      children: [
        m.Div({
          class: "f8 b w2 light-silver",
          children: derive(() => month.value.substring(0, 3)),
        }),
        m.Div({
          class: "w-100 flex items-center justify-between",
          children: m.For({
            subject: status,
            map: (level) =>
              ColorDot({
                classNames: "pa1",
                colorIndex: colorIndex,
                level: level,
                totalLevels: totalLevels,
              }),
          }),
        }),
      ],
    });
  }
);
