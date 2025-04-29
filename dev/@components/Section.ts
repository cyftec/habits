import { derive, dstring } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";

type SectionProps = {
  classNames?: string;
  title: string;
  description?: string;
  showDescription?: boolean;
  child: Child;
};

export const Section = component<SectionProps>(
  ({ classNames, title, description, showDescription, child }) => {
    return m.Div({
      class: dstring`mt3 mb4 ${classNames}`,
      children: [
        m.Div({
          class: "mb2 dark-gray f4 b",
          children: title,
        }),
        m.If({
          subject: derive(() => description?.value && showDescription?.value),
          isTruthy: m.Div({
            class: "mb3 f6 silver fw5",
            children: dstring`${description}`,
          }),
        }),
        m.Div(child),
      ],
    });
  }
);
