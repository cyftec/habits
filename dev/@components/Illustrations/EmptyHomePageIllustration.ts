import { component, m } from "@mufw/maya";
import { AddHabitButton } from "../AddHabitButton";
import { dstring } from "@cyftech/signal";

type EmptyHomePageIllustrationProps = {
  classNames?: string;
};

export const EmptyHomePageIllustration =
  component<EmptyHomePageIllustrationProps>(({ classNames }) => {
    return m.Div({
      class: dstring`flex flex-column items-center justify-around ${classNames}`,
      children: [
        m.Img({
          class: "mt3 pt4",
          src: "/assets/images/just_landed.png",
          height: "200",
        }),
        m.Div("Looks like, you just landed here!"),
        AddHabitButton({
          classNames: "pt5",
          justifyClassNames: "justify-around",
          label: "Add your first habit",
        }),
      ],
    });
  });
