import { derive, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { DAYS_OF_WEEK, MONTHS } from "../../@common/constants";
import { Habit } from "../../@common/types";
import { tryFetchingHabitUsingParams } from "../../@common/utils";
import { Section } from "../../@components";
import { Button, ColorDot, Icon, Page, Scaffold } from "../../@elements";

const error = signal("");
const habit = signal<Habit | undefined>(undefined);
const pageTitle = derive(() => (habit.value ? habit.value.title : "Loading.."));

const acheievemnts = derive(() => {
  const currentHabit = habit.value;
  if (!currentHabit) return [];
  const acheievemntsList = currentHabit.tracker.reduce((arr, status) => {
    if (status > -1) arr[status] = arr[status] ? arr[status] + 1 : 1;
    return arr;
  }, [] as number[]);
  return acheievemntsList;
});

const weekwiseTracker = derive(() => {
  const currentHabit = habit.value;
  if (!currentHabit) return [];
  const firstDayTime = currentHabit.id;
  const firstDay = new Date(firstDayTime);
  const firstDayIndex = firstDay.getDay();
  const tracker = currentHabit.tracker;
  const trackerStartingSunday: (number | undefined)[] = [...tracker];
  Array(firstDayIndex)
    .fill(undefined)
    .forEach((x) => trackerStartingSunday.unshift(x));
  Array(7 - (trackerStartingSunday.length % 7))
    .fill(undefined)
    .forEach((x) => trackerStartingSunday.push(x));
  const weeklyTracker: { level: number | undefined; date: Date }[][] = [];

  for (let i = 0; i < trackerStartingSunday.length; i++) {
    const index = Math.floor(i / 7);
    if (!weeklyTracker[index]) weeklyTracker[index] = [];
    weeklyTracker[index][i % 7] = {
      level: trackerStartingSunday[i],
      date: new Date(
        firstDay.getFullYear(),
        firstDay.getMonth(),
        firstDay.getDate() - firstDayIndex + i
      ),
    };
  }

  return weeklyTracker;
});

const onPageMount = () => {
  console.log("reached here");
  const [fetchedHabit, err] = tryFetchingHabitUsingParams();
  if (err || !fetchedHabit) {
    error.value = err || "Nohabit found for 'id' in query param";
    return;
  }
  habit.value = fetchedHabit;
};

export default Page({
  onMount: onPageMount,
  body: Scaffold({
    classNames: "bg-white ph3",
    header: m.Div({
      class: "flex items-start justify-between",
      children: [
        m.Div({
          class: dstring`${() =>
            pageTitle.value.length > 22 ? "f2dot66" : ""}`,
          children: pageTitle,
        }),
        m.If({
          subject: derive(() => habit.value?.isStopped),
          isFalsy: Icon({
            className: "mt2 mr1 ba b--moon-gray bw1 br-100 pa1 noselect",
            size: 22,
            iconName: "edit",
            onClick: () => {
              if (habit.value) location.href = `edit/?id=${habit.value.id}`;
            },
          }),
        }),
      ],
    }),
    content: m.Div({
      children: [
        m.If({
          subject: error,
          isTruthy: m.Div({ class: "red", children: error }),
          isFalsy: m.Div(
            m.If({
              subject: habit,
              isFalsy: m.Div({ class: "", children: "habit.." }),
              isTruthy: m.Div({
                children: [
                  m.If({
                    subject: derive(() => !!habit.value?.isStopped),
                    isTruthy: m.Div([
                      m.Div({
                        class: "red mb3",
                        children: "Status: STOPPED PERMANENTLY",
                      }),
                      Button({
                        className: "pv2 ph3 nt2 mb4 red",
                        onTap: function (): void {
                          throw new Error("Function not implemented.");
                        },
                        children: "Delete Permanently",
                      }),
                    ]),
                  }),
                  Section({
                    title: "Acheivment",
                    child: m.Div({
                      children: m.For({
                        subject: acheievemnts,
                        map: (acheievemnt, i) =>
                          m.Div({
                            children: derive(
                              () => `${habit.value?.levels[i]}: ${acheievemnt}%`
                            ),
                          }),
                      }),
                    }),
                  }),
                  Section({
                    title: "Tracker",
                    child: m.Div({
                      children: [
                        m.Div({
                          class: "mh2 flex items-center justify-between",
                          children: m.For({
                            subject: DAYS_OF_WEEK,
                            map: (day) =>
                              m.Div({
                                class:
                                  "h2 w2 br-100 gray f7 flex items-center justify-center",
                                children: day.charAt(0),
                              }),
                          }),
                        }),
                        m.Div({
                          class: "mh2 h5 overflow-y-scroll",
                          children: m.For({
                            subject: weekwiseTracker,
                            map: (week) =>
                              m.Div({
                                class: "flex items-center h-60",
                                children: [
                                  m.Div({
                                    class:
                                      "w-100 mb3 flex items-center justify-between",
                                    children: m.For({
                                      subject: week,
                                      map: (day) => {
                                        const dateNum = day.date.getDate();
                                        const monthIndex = day.date.getMonth();
                                        const monthName = MONTHS[
                                          monthIndex
                                        ].substring(0, 3);
                                        const dateText = `${
                                          dateNum === 1
                                            ? monthIndex === 0
                                              ? day.date
                                                  .getFullYear()
                                                  .toString()
                                              : monthName
                                            : dateNum
                                        }`;

                                        return ColorDot({
                                          classNames:
                                            "h2 w2 flex items-center justify-center f7",
                                          colorIndex:
                                            habit.value?.colorIndex ?? 0,
                                          level: day.level ?? -1,
                                          totalLevels:
                                            habit.value?.levels.length || 2,
                                          textContent: dateText,
                                          showText: day.level !== undefined,
                                        });
                                      },
                                    }),
                                  }),
                                ],
                              }),
                          }),
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            })
          ),
        }),
      ],
    }),
    bottombar: m.Div({
      class: "pb3",
      children: Button({
        className: "pa3 flex items-center",
        children: [
          Icon({ iconName: "arrow_back" }),
          m.Span({
            class: "ml1",
            children: `Go Back`,
          }),
        ],
        onTap: () => history.back(),
      }),
    }),
  }),
});
