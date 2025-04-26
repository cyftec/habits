import { Child, Children, component, m } from "@mufw/maya";
import { dstring, MaybeSignal } from "@cyftech/signal";

type ButtonProps = {
  className?: string;
  onTap: () => void;
  children: Children;
};

export const Button = component<ButtonProps>(({ className, onTap, children }) =>
  m.Button({
    class: dstring`br-pill ba bw1 b--light-silver b--hover-black pointer bg-white black ${className}`,
    onclick: () => onTap(),
    children: children,
  })
);
