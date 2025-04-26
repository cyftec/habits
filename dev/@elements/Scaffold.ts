import { dstring } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";

type ScaffoldProps = {
  classNames?: string;
  header?: Child;
  content: Child;
  bottombar?: Child;
};

export const Scaffold = component<ScaffoldProps>(
  ({ classNames, header, content, bottombar }) => {
    return m.Div({
      class: dstring`${classNames}`,
      children: [
        m.If({
          subject: header,
          isTruthy: m.Div({
            class:
              "overflow-break-word sticky top-0 left-0 right-0 bg-inherit z-999 f2dot33 b pv3 mt2",
            children: header,
          }),
        }),
        content,
        m.Div({ class: "pv6 mt5" }),
        m.If({
          subject: bottombar,
          isTruthy: m.Div({
            class: "sticky bottom-0 left-0 right-0 z-9999",
            children: bottombar,
          }),
        }),
      ],
    });
  }
);
