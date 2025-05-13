import { derive, dstring } from "@cyftech/signal";
import { Children, component, m } from "@mufw/maya";

type SectionProps = {
  classNames?: string;
  contentClassNames?: string;
  title: string;
  description?: string;
  hideDescription?: boolean;
  children: Children;
};

export const Section = component<SectionProps>(
  ({
    classNames,
    contentClassNames,
    title,
    description,
    hideDescription,
    children,
  }) => {
    const showDescription = derive(
      () => description?.value && !hideDescription?.value
    );

    return m.Div({
      class: dstring`mt3 mb4 ${classNames}`,
      children: [
        m.Div({
          class: "mb2 dark-gray f4 b",
          children: title,
        }),
        m.If({
          subject: showDescription,
          isTruthy: m.Div({
            class: "mb3 f6 silver fw5",
            children: dstring`${description}`,
          }),
        }),
        m.Div({ class: contentClassNames, children }),
      ],
    });
  }
);
