import { component, m } from "@mufw/maya";
import { AddHabitButton } from "../AddHabitButton";
import { tmpl } from "@cyftech/signal";

type EmptyHomePageIllustrationProps = {
  cssClasses?: string;
};

export const EmptyHomePageIllustration =
  component<EmptyHomePageIllustrationProps>(({ cssClasses }) => {
    return m.Div({
      class: tmpl`flex flex-column items-center justify-around ${cssClasses}`,
      children: [
        m.Img({
          class: "mt3 pt4",
          src: "/assets/images/just_landed.png",
          height: "200",
        }),
        m.Div("Looks like, you just landed here!"),
        AddHabitButton({
          cssClasses: "pt5",
          justifyCssClasses: "justify-around",
          label: "Add your first habit",
        }),
      ],
    });
  });
