import { derive, dobject, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  getCompletion,
  getMilestone,
  getMonthFirstDates,
} from "../@common/transforms";
import { HabitUI } from "../@common/types";
import { handleCTA } from "../@common/utils";
import { Icon } from "../@elements";
import { MonthMap } from "./MonthMap";

type HabitCardProps = {
  classNames?: string;
  habit: HabitUI;
  months: number;
  onClick: () => void;
};

export const HabitCard = component<HabitCardProps>(
  ({ classNames, habit, months, onClick }) => {
    const { milestones, title, colorIndex, levels } = dobject(
      derive(() => habit.value)
    ).props;
    const completion = derive(() => {
      const now = new Date();
      const thisYear = now.getFullYear();
      const thisMonth = now.getMonth();
      const firstDay = new Date(thisYear, thisMonth - months.value, 1);
      const lastDay = new Date(thisYear, thisMonth + 1, 0);
      return getCompletion(habit.value, firstDay, lastDay).percent;
    });
    const milestoneIcon = derive(
      () => getMilestone(milestones.value, completion.value).icon
    );
    const milestoneIconColor = derive(
      () => getMilestone(milestones.value, completion.value).color
    );

    return m.Div({
      class: dstring`pointer bg-white ${classNames}`,
      onclick: handleCTA(onClick),
      children: [
        m.Div({
          class: "flex items-center justify-between nt1 mb2",
          children: [
            m.Div({
              class: "f4 dark-gray b",
              children: title,
            }),
            m.Div({
              class: "f6 silver b flex items-center",
              children: [
                Icon({
                  className: dstring`mr1 ${milestoneIconColor}`,
                  iconName: milestoneIcon,
                }),
                dstring`${completion}%`,
              ],
            }),
          ],
        }),
        m.Div({
          class: "mt3 mb1",
          children: m.For({
            subject: getMonthFirstDates(months.value),
            map: (monthFirstDay) =>
              MonthMap({
                classNames: "mb1",
                habit: habit,
                date: monthFirstDay,
                colorIndex: colorIndex,
                totalLevels: levels.value.length,
              }),
          }),
        }),
      ],
    });
  }
);
