import { dstring } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";

type SectionProps = {
  classNames?: string;
  title: string;
  child: Child;
};

export const Section = component<SectionProps>(
  ({ classNames, title, child }) => {
    return m.Div({
      class: dstring`mt3 mb4 ${classNames}`,
      children: [
        m.Div({
          class: "mb2 dark-gray f4 b",
          children: title,
        }),
        m.Div(child),
      ],
    });
  }
);
