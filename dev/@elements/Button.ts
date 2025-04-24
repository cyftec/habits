import { component, m } from "@mufw/maya";
import { dstring } from "@cyftech/signal";

type ButtonProps = {
  className?: string;
  label: string;
  onTap: () => void;
};

export const Button = component<ButtonProps>(({ className, onTap, label }) =>
  m.Button({
    class: dstring`br-pill ba bw1 b--light-silver b--hover-black pointer bg-white black ${className}`,
    onclick: () => onTap(),
    children: label,
  })
);
