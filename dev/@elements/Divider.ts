import { tmpl } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type DividerProps = {
  cssClasses?: string;
};

export const Divider = component<DividerProps>(({ cssClasses }) => {
  return m.Div({ class: tmpl`bb b--light-gray ${cssClasses}` });
});
