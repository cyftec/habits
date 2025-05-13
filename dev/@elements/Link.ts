import { derive, dstring } from "@cyftech/signal";
import { Children, component, m } from "@mufw/maya";
import { handleCTA } from "../@common/utils";

type LinkProps = {
  classNames?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
  children: Children;
};

export const Link = component<LinkProps>(
  ({ classNames, href, target, onClick, children }) => {
    const linkCss = derive(() =>
      href?.value || onClick ? "pointer underline" : ""
    );

    return m.A({
      class: dstring`noselect ${linkCss} ${classNames}`,
      href,
      target,
      onclick: handleCTA(onClick),
      children,
    });
  }
);
