import { Child, Children, component, m } from "@mufw/maya";
import { dstring, MaybeSignal } from "@cyftech/signal";
import { handleTap } from "../@common/utils";

type ButtonProps = {
  classNames?: string;
  onTap: () => void;
  children: Children;
};

export const Button = component<ButtonProps>(
  ({ classNames, onTap, children }) =>
    m.Button({
      class: dstring`pointer noselect br-pill ba bw1 b--light-silver b--hover-black bg-white black ${classNames}`,
      onclick: handleTap(() => onTap()),
      children: children,
    })
);
