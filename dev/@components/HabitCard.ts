import { component, m } from "@mufw/maya";
import { Habit } from "../@common/types";
import { derive, dobject, dstring } from "@cyftech/signal";
import { getMilestone, getMonthsStatus, vibrateOnTap } from "../@common/utils";
import { MonthMap } from "./MonthMap";
import { MONTHS } from "../@common/constants";
import { Icon } from "../@elements";

type HabitCardProps = {
  classNames?: string;
  habit: Habit & { completion: number };
  months: number;
  onClick: () => void;
};

export const HabitCard = component<HabitCardProps>(
  ({ classNames, habit, months, onClick }) => {
    const { milestones, title, completion, colorIndex, levels } = dobject(
      derive(() => habit.value)
    ).props;
    const monthsTrackerList = derive(() =>
      getMonthsStatus(habit.value, months.value)
    );
    const milestoneIcon = derive(
      () => getMilestone(milestones.value, completion.value).icon
    );
    const milestoneIconColor = derive(
      () => getMilestone(milestones.value, completion.value).color
    );

    return m.Div({
      class: dstring`pointer bg-white ${classNames}`,
      onclick: vibrateOnTap(onClick),
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
            subject: monthsTrackerList,
            map: (tracker) =>
              MonthMap({
                classNames: "mb1",
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
