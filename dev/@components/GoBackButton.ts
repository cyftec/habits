import { component, m } from "@mufw/maya";
import { Button, Icon } from "../@elements";
import { dstring } from "@cyftech/signal";

type GoBackButtonProps = {
  classNames?: string;
};

export const GoBackButton = component<GoBackButtonProps>(({ classNames }) => {
  return Button({
    classNames: dstring`pa3 flex items-center ${classNames}`,
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
