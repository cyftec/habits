import { component, m } from "@mufw/maya";
import { Habit } from "../@common/types";
import { derive, dobject, dstring } from "@cyftech/signal";
import { getMonthsStatus } from "../@common/utils";
import { MonthMap } from "./MonthMap";
import { MONTHS } from "../@common/constants";

type HabitCardProps = {
  classNames?: string;
  habit: Habit & { completion: number };
  months: number;
};

export const HabitCard = component<HabitCardProps>(
  ({ classNames, habit, months }) => {
    const { id, title, completion, colorIndex, levels } = dobject(
      derive(() => habit.value)
    ).props;
    const monthsTrackerList = derive(() =>
      getMonthsStatus(habit.value, months.value)
    );

    return m.Div({
      class: dstring`bg-white br4 pa3 ${classNames}`,
      onclick: () => (location.href = `/habit/?id=${id}`),
      children: [
        m.Div({
          class: "flex items-center justify-between nt1 mb2",
          children: [
            m.Div({
              class: "f5 b",
              children: title,
            }),
            m.Div({
              class: "f6 silver b",
              children: dstring`${completion}%`,
            }),
          ],
        }),
        m.Div({
          children: m.For({
            subject: monthsTrackerList,
            map: (tracker) =>
              MonthMap({
                classNames: "mt05",
                month: MONTHS[tracker.monthIndex],
                status: tracker.status,
                colorIndex: colorIndex,
                totalLevels: levels.value.length,
              }),
          }),
        }),
      ],
    });
  }
);
