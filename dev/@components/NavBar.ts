import { compute, derive, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { goToHref, handleTap } from "../@common/utils";
import { Icon } from "../@elements";

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
    const fontColor = compute(isSelected).oneOf("app-theme-color b", "black");

    return m.Div({
      class: dstring`pointer noselect flex flex-column items-center justify-center pb2 ${fontColor} ${classNames}`,
      onclick: handleTap(() => goToHref(href.value)),
      children: [
        Icon({ size: 22, iconName: icon }),
        m.Div({ class: "f7", children: label }),
      ],
    });
  }
);
