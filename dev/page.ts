import { Child, m } from "@mufw/maya";
import { Button, ColorDot, Page, Scaffold } from "./@elements";
import { dstring, signal } from "@cyftech/signal";
import { Habit } from "./@common/types";

const habits = signal<Habit[]>([]);

export default Page({
  onMount: () => {
    const updatedHabits = [...habits.value];
    for (let key in localStorage) {
      if (!key.startsWith("h.")) continue;
      const habit: Habit | string = JSON.parse(localStorage.getItem(key) || "");
      if (typeof habit !== "object") continue;
      updatedHabits.push(habit as Habit);
    }
    habits.value = updatedHabits;
  },
  body: Scaffold({
    classNames: "bg-white ph3",
    header: "Daily habits",
    content: m.Div({
      onclick: () => (location.href = "/habit"),
      children: m.For({
        subject: habits,
        map: (habit) =>
          m.Div({
            class: "mb4",
            children: [
              m.Div({
                class: "flex items-center justify-between mb2",
                children: [
                  m.Div({
                    class: "f5 b",
                    children: habit.title,
                  }),
                  m.Div({
                    class: "f6 silver b",
                    children: "57%",
                  }),
                ],
              }),
              m.Div({
                class: "flex items-center",
                children: [
                  m.Div({
                    class: "f7 mr1",
                    children: "J",
                  }),
                  m.Div({
                    class: "w-100 flex items-center justify-between",
                    children: m.For({
                      subject: [
                        0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1,
                        0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0,
                      ],
                      map: (level) =>
                        ColorDot({
                          classNames: "pa1",
                          colorIndex: habit.colorIndex,
                          level: level,
                          totalLevels: 2,
                        }),
                    }),
                  }),
                ],
              }),
              m.Div({
                class: "flex items-center",
                children: [
                  m.Div({
                    class: "f7 mr1",
                    children: "J",
                  }),
                  m.Div({
                    class: "w-100 flex items-center justify-between",
                    children: m.For({
                      subject: [
                        0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1,
                        0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0,
                      ],
                      map: (level) =>
                        ColorDot({
                          classNames: "pa1",
                          colorIndex: habit.colorIndex,
                          level: level,
                          totalLevels: 2,
                        }),
                    }),
                  }),
                ],
              }),
              m.Div({
                class: "flex items-center",
                children: [
                  m.Div({
                    class: "f7 mr1",
                    children: "J",
                  }),
                  m.Div({
                    class: "w-100 flex items-center justify-between",
                    children: m.For({
                      subject: [
                        0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1,
                        0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0,
                      ],
                      map: (level) =>
                        ColorDot({
                          classNames: "pa1",
                          colorIndex: habit.colorIndex,
                          level: level,
                          totalLevels: 2,
                        }),
                    }),
                  }),
                ],
              }),
              m.Div({
                class: "flex items-center",
                children: [
                  m.Div({
                    class: "f7 mr1",
                    children: "J",
                  }),
                  m.Div({
                    class: "w-100 flex items-center justify-between",
                    children: m.For({
                      subject: [
                        0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1,
                        0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0,
                      ],
                      map: (level) =>
                        ColorDot({
                          classNames: "pa1",
                          colorIndex: habit.colorIndex,
                          level: level,
                          totalLevels: 2,
                        }),
                    }),
                  }),
                ],
              }),
              m.Div({
                class: "flex items-center",
                children: [
                  m.Div({
                    class: "f7 mr1",
                    children: "J",
                  }),
                  m.Div({
                    class: "w-100 flex items-center justify-between",
                    children: m.For({
                      subject: [
                        0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1,
                        0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0,
                      ],
                      map: (level) =>
                        ColorDot({
                          classNames: "pa1",
                          colorIndex: habit.colorIndex,
                          level: level,
                          totalLevels: 2,
                        }),
                    }),
                  }),
                ],
              }),
              m.Div({
                class: "flex items-center",
                children: [
                  m.Div({
                    class: "f7 mr1",
                    children: "J",
                  }),
                  m.Div({
                    class: "w-100 flex items-center justify-between",
                    children: m.For({
                      subject: [
                        0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1,
                        0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0,
                      ],
                      map: (level) =>
                        ColorDot({
                          classNames: "pa1",
                          colorIndex: habit.colorIndex,
                          level: level,
                          totalLevels: 2,
                        }),
                    }),
                  }),
                ],
              }),
            ],
          }),
      }),
    }),
    bottombar: Button({
      className: "mv3",
      label: dstring`Add new target`,
      onTap: () => (location.href = "/edit/?target=new"),
    }),
  }),
});
