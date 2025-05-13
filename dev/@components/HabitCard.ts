import { derive, dobject, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  getAchievedMilestone,
  getCompletion,
  getDateWindow,
  getMonthFirstDates,
} from "../@common/transforms";
import { HabitUI } from "../@common/types";
import { handleTap } from "../@common/utils";
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
    const habitVal = derive(() => habit.value);
    const { milestones, title, colorIndex, levels } = dobject(habitVal).props;
    const completion = derive(() => {
      const { startDate, endDate } = getDateWindow(months.value);
      return getCompletion(habit.value, startDate, endDate).percent;
    });
    const achievedMilestone = derive(() =>
      getAchievedMilestone(milestones.value, completion.value)
    );
    const { icon, color } = dobject(achievedMilestone).props;
    const monthFirstDates = derive(() => getMonthFirstDates(months.value));

    return m.Div({
      class: dstring`pointer bg-white ${classNames}`,
      onclick: handleTap(onClick),
      children: [
        m.Div({
          class: "flex items-center justify-between nt1 mb2",
          children: [
            m.Div({
              class: "f5 dark-gray b",
              children: title,
            }),
            m.Div({
              class: "f6 silver b flex items-center",
              children: [
                Icon({
                  classNames: dstring`mr1 ${color}`,
                  iconName: icon,
                }),
                dstring`${completion}%`,
              ],
            }),
          ],
        }),
        m.Div({
          class: "mt2 mb1",
          children: m.For({
            subject: monthFirstDates,
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
