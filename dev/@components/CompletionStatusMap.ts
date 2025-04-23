import { component, m } from "@mufw/maya";
import { MonthMap } from "./MonthMap";
import { derive } from "@cyftech/signal";
import { getMonthStatus } from "../@common/utils";
import { MONTHS } from "../@common/constants";

type CompletionStatusMapProps = {
  habitCreationTime: number;
  trackRecord: number[];
  completionLevels: number;
  colorIndex: number;
  currentYear: number;
  currentMonth: number;
  monthsCount: 2 | 6;
};

export const CompletionStatusMap = component<CompletionStatusMapProps>(
  ({
    habitCreationTime,
    trackRecord,
    completionLevels,
    colorIndex,
    currentYear,
    currentMonth,
    monthsCount,
  }) => {
    const monthlyTrackers = derive(() => {
      const dates = Array(monthsCount.value)
        .fill(0)
        .map((x, i) => new Date(currentYear.value, currentMonth.value - i, 1))
        .reverse();
      return dates.map((d) => {
        const monthIndex = d.getMonth();
        return {
          monthIndex,
          status: getMonthStatus(
            habitCreationTime.value,
            trackRecord.value,
            d.getFullYear(),
            monthIndex
          ),
        };
      });
    });
    return m.Div({
      children: m.For({
        subject: monthlyTrackers,
        map: (tracker) =>
          MonthMap({
            classNames: "mt05",
            month: MONTHS[tracker.monthIndex],
            colorIndex: colorIndex,
            totalLevels: completionLevels,
            status: tracker.status,
          }),
      }),
    });
  }
);
