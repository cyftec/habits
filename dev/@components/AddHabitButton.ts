import { component, m } from "@mufw/maya";
import { Button, Icon } from "../@elements";
import { derive, dstring } from "@cyftech/signal";
import { goToNewHabitsPage } from "../@common/utils";

type AddHabitButtonProps = {
  classNames?: string;
  justifyClassNames?: string;
  label?: string;
};

export const AddHabitButton = component<AddHabitButtonProps>(
  ({ classNames, justifyClassNames, label }) => {
    return m.Div({
      class: dstring`w-100 flex ${() =>
        justifyClassNames?.value || "justify-end"} ${classNames}`,
      children: Button({
        className: "pa3 mb3 shadow-4 b flex items-center",
        children: [
          Icon({
            className: "nl1 mr1",
            size: 22,
            iconName: "add",
          }),
          derive(() => label?.value || `Add habit`),
        ],
        onTap: goToNewHabitsPage,
      }),
    });
  }
);
