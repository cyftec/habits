import { Child, component, m } from "@mufw/maya";

type ScaffoldProps = {
  classNames?: string;
  header: string;
  content: Child;
  bottombar: Child;
};

export const Scaffold = component<ScaffoldProps>(
  ({ classNames, header, content, bottombar }) => {
    return m.Div({
      class: classNames,
      children: [
        m.Div({
          class: "sticky top-0 left-0 right-0 bg-white f2 b pv3",
          children: header,
        }),
        content,
        m.Div({
          class: "sticky bottom-0 left-0 right-0 bg-white",
          children: bottombar,
        }),
      ],
    });
  }
);
