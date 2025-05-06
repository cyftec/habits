import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type DividerProps = {
  classNames?: string;
};

export const Divider = component<DividerProps>(({ classNames }) => {
  return m.Div({ class: dstring`bb b--light-gray ${classNames}` });
});
