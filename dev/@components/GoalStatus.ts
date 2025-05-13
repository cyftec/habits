import { compute, derive, dobject, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { AchievedMilestone, MilestonesUI } from "../@common/types";

type GoalStatusProps = {
  classNames?: string;
  milestones: MilestonesUI;
  achievedMilestone: AchievedMilestone;
  completionPercent: number;
};

export const GoalStatus = component<GoalStatusProps>(
  ({ classNames, milestones, achievedMilestone, completionPercent }) => {
    const achievedMilestoneColor = dobject(achievedMilestone).prop("color");
    const completionLabel = derive(() =>
      completionPercent.value > 53
        ? "Average completion"
        : completionPercent.value > 43
        ? "Avg completion"
        : completionPercent.value > 35
        ? "Completion"
        : ""
    );

    return m.Div({
      class: dstring`center ${classNames}`,
      children: [
        m.Div({
          class: "pb2 w-100 relative",
          children: m.For({
            subject: milestones,
            map: (milestone, i) => {
              return CrossSection({
                colorCss: `bg-${milestone.color}`,
                percent: milestone.upperLimit,
                hideUpperLimit: i === 0,
              });
            },
          }),
        }),
        m.Div({
          class: dstring`nt3dot6 h1dot2 bw1 relative br b--${achievedMilestoneColor}`,
          style: derive(() => `width: ${completionPercent.value}%;`),
          children: m.Div({
            class: dstring`relative flex items-start nt1 justify-between f7 mid-gray`,
            children: [
              m.Div(completionLabel),
              m.Div({
                class: dstring`absolute right-0 pr1 b f6 ${achievedMilestoneColor}`,
                children: derive(() => `${completionPercent.value}%`),
              }),
            ],
          }),
        }),
      ],
    });
  }
);

type CrossSectionProps = {
  colorCss: string;
  percent: number;
  hideUpperLimit?: boolean;
};

const CrossSection = component<CrossSectionProps>(
  ({ colorCss, hideUpperLimit, percent }) => {
    const percentLabel = compute(hideUpperLimit).oneOf(
      "",
      dstring`${percent}%`
    );
    const widthStyle = derive(() => `width: ${percent.value}%;`);

    return m.Div({
      class: "absolute flex items-start h0dot5 bl br b--light-silver bw1",
      style: widthStyle,
      children: [
        m.Div({
          class: dstring`absolute absolute-fill h0dot15 w-100 ${colorCss}`,
        }),
        m.Div({
          class: "flex justify-end w-100 pt2 f7",
          children: m.Div({
            class: "nr3 pb2 light-silver b",
            children: percentLabel,
          }),
        }),
      ],
    });
  }
);
