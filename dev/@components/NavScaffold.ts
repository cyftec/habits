import { derive } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import { Scaffold } from "../@elements";
import { NavBar } from "./NavBar";

type NavScaffoldProps = {
  classNames?: string;
  header?: Child;
  content: Child;
  navbarTop?: Child;
  route: string;
};

export const NavScaffold = component<NavScaffoldProps>(
  ({ classNames, header, content, navbarTop, route }) => {
    return Scaffold({
      classNames: classNames,
      header: header,
      content: content,
      bottombar: m.Div({
        children: [
          m.If({
            subject: navbarTop,
            isTruthy: navbarTop as Child,
          }),
          NavBar({
            classNames: "nl3 nr3 ph4",
            links: derive(() => [
              {
                label: "Today",
                icon: "calendar_month",
                isSelected: route.value === "/",
                href: "/",
              },
              {
                label: "Habits",
                icon: "checklist",
                isSelected: route.value === "/habits/",
                href: "/habits/",
              },
              {
                label: "Settings",
                icon: "settings",
                isSelected: route.value === "/settings/",
                href: "/settings/",
              },
            ]),
          }),
        ],
      }),
    });
  }
);
