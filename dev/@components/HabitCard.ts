import { compute, tmpl, trap } from "@cyftech/signal";
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
  cssClasses?: string;
  habit: HabitUI;
  months: number;
  onClick: () => void;
};

export const HabitCard = component<HabitCardProps>(
  ({ cssClasses, habit, months, onClick }) => {
    const { milestones, title, colorIndex, levels } = trap(habit).props;
    const completion = compute(
      (months: number, habit: HabitUI) => {
        const { startDate, endDate } = getDateWindow(months);
        return getCompletion(habit, startDate, endDate).percent;
      },
      months,
      habit
    );
    const achievedMilestone = compute(
      getAchievedMilestone,
      milestones,
      completion
    );
    const { icon, color } = trap(achievedMilestone).props;
    const monthFirstDates = compute(getMonthFirstDates, months);

    return m.Div({
      class: tmpl`pointer bg-white ${cssClasses}`,
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
                  cssClasses: tmpl`mr1 ${color}`,
                  iconName: icon,
                }),
                tmpl`${completion}%`,
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
                cssClasses: "mb1",
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
