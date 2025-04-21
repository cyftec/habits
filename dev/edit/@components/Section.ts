import { Child, component, m } from "@mufw/maya";

type SectionProps = {
  title: string;
  child: Child;
};

export const Section = component<SectionProps>(({ title, child }) => {
  return m.Div({
    class: "mb4",
    children: [
      m.Div({
        class: "mb2 f5 b",
        children: title,
      }),
      m.Div(child),
    ],
  });
});
