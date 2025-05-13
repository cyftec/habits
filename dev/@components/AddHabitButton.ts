import { compute, derive, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { goToNewHabitsPage } from "../@common/utils";
import { Button, Icon } from "../@elements";

type AddHabitButtonProps = {
  classNames?: string;
  justifyClassNames?: string;
  label?: string;
};

export const AddHabitButton = component<AddHabitButtonProps>(
  ({ classNames, justifyClassNames, label }) => {
    const justifyCss = compute(justifyClassNames).or("justify-end");
    const buttonLabel = compute(label).or(`Add habit`);

    return m.Div({
      class: dstring`w-100 flex ${justifyCss} ${classNames}`,
      children: Button({
        classNames: "pa3 mb3 shadow-4 b flex items-center",
        children: [
          Icon({
            classNames: "nl1 mr1",
            size: 22,
            iconName: "add",
          }),
          buttonLabel,
        ],
        onTap: goToNewHabitsPage,
      }),
    });
  }
);
