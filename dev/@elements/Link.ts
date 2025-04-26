import { dstring } from "@cyftech/signal";
import { Children, component, m } from "@mufw/maya";

type LinkProps = {
  classNames?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
  children: Children;
};

export const Link = component<LinkProps>(
  ({ classNames, href, target, onClick, children }) => {
    return m.A({
      class: dstring`${() =>
        !href && !onClick ? "" : "underline"} ${classNames}`,
      href,
      target,
      onclick: () => onClick && onClick(),
      children,
    });
  }
);
