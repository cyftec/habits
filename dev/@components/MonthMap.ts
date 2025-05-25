import { compute, derive, tmpl } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  getHabitStatusBetweenDates,
  getMonthName,
} from "../@common/transforms";
import { HabitUI } from "../@common/types";
import { ColorDot } from "./ColorDot";

type MonthMapProps = {
  cssClasses?: string;
  habit: HabitUI;
  date: Date;
  colorIndex: number;
  totalLevels: number;
};

export const MonthMap = component<MonthMapProps>(
  ({ cssClasses, habit, date, colorIndex, totalLevels }) => {
    const statusList = derive(() => {
      const dateYear = date.value.getFullYear();
      const dateMonth = date.value.getMonth();
      const firstDay = new Date(dateYear, dateMonth, 1);
      const lastDay = new Date(dateYear, dateMonth + 1, 0);
      return getHabitStatusBetweenDates(habit.value.tracker, firstDay, lastDay);
    });

    return m.Div({
      class: tmpl`flex items-center ${cssClasses}`,
      children: [
        m.Div({
          class: "f8 b w2 light-silver",
          children: derive(() => getMonthName(date.value.getMonth(), 3)),
        }),
        m.Div({
          class: "w-100 flex items-center justify-between",
          children: m.For({
            subject: statusList,
            map: (status) =>
              ColorDot({
                cssClasses: "pa1",
                colorIndex: colorIndex,
                level: status.level.code,
                totalLevels: totalLevels,
              }),
          }),
        }),
      ],
    });
  }
);
