import { Child, component, m } from "@mufw/maya";
import { Icon } from "../@elements";
import { dstring } from "@cyftech/signal";
import { goToHref, handleCTA } from "../@common/utils";

type NavBarProps = {
  classNames?: string;
  links: {
    label: string;
    icon: string;
    isSelected: boolean;
    href: string;
  }[];
};

export const NavBar = component<NavBarProps>(({ classNames, links }) => {
  return m.Div({
    class: dstring`flex items-center justify-between pv3 bg-near-white ${classNames}`,
    children: m.For({
      subject: links,
      map: (link) =>
        NavBarLink({
          label: link.label,
          icon: link.icon,
          isSelected: link.isSelected,
          href: link.href,
        }),
    }),
  });
});

type NavBarLinkProps = {
  classNames?: string;
  label: string;
  icon: string;
  isSelected: boolean;
  href: string;
};

export const NavBarLink = component<NavBarLinkProps>(
  ({ classNames, label, icon, isSelected, href }) => {
    return m.Div({
      class: dstring`pointer noselect flex flex-column items-center justify-center pb2 ${() =>
        isSelected.value ? "app-theme-color b" : "black"} ${classNames}`,
      onclick: handleCTA(() => goToHref(href.value)),
      children: [
        Icon({
          size: 22,
          iconName: icon,
        }),
        m.Div({
          class: "f7",
          children: label,
        }),
      ],
    });
  }
);
