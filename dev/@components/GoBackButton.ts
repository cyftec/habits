import { component, m } from "@mufw/maya";
import { Button, Icon } from "../@elements";
import { tmpl } from "@cyftech/signal";

type GoBackButtonProps = {
  cssClasses?: string;
};

export const GoBackButton = component<GoBackButtonProps>(({ cssClasses }) => {
  return Button({
    cssClasses: tmpl`pa3 flex items-center ${cssClasses}`,
    children: [
      Icon({ iconName: "arrow_back" }),
      m.Span({
        class: "ml1",
        children: `Go Back`,
      }),
    ],
    onTap: () => history.back(),
  });
});
