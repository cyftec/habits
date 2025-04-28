import { Child, Children, component, m } from "@mufw/maya";
import { dstring, MaybeSignal } from "@cyftech/signal";
import { vibrateOnTap } from "../@common/utils";

type ButtonProps = {
  className?: string;
  onTap: () => void;
  children: Children;
};

export const Button = component<ButtonProps>(({ className, onTap, children }) =>
  m.Button({
    class: dstring`pointer br-pill ba bw1 b--light-silver b--hover-black bg-white black ${className}`,
    onclick: vibrateOnTap(() => onTap()),
    children: children,
  })
);
