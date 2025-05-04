import { Child, Children, component, m } from "@mufw/maya";
import { dstring, MaybeSignal } from "@cyftech/signal";
import { handleCTA } from "../@common/utils";

type ButtonProps = {
  className?: string;
  onTap: () => void;
  children: Children;
};

export const Button = component<ButtonProps>(({ className, onTap, children }) =>
  m.Button({
    class: dstring`pointer noselect br-pill ba bw1 b--light-silver b--hover-black bg-white black ${className}`,
    onclick: handleCTA(() => onTap()),
    children: children,
  })
);
