import { op, tmpl } from "@cyftech/signal";
import { Children, component, m } from "@mufw/maya";
import { handleTap } from "../@common/utils";

type LinkProps = {
  cssClasses?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
  children: Children;
};

export const Link = component<LinkProps>(
  ({ cssClasses, href, target, onClick, children }) => {
    const linkCss = op(href).or(onClick).ternary("pointer underline", "");

    return m.A({
      class: tmpl`noselect ${linkCss} ${cssClasses}`,
      href,
      target,
      onclick: handleTap(onClick),
      children,
    });
  }
);
