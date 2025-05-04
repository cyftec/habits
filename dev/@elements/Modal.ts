import { dstring, effect } from "@cyftech/signal";
import { type Children, component, m } from "@mufw/maya";
import { handleCTA } from "../@common/utils";

type ModalProps = {
  classNames?: string;
  isOpen: boolean;
  content: Children;
  onTapOutside?: () => void;
};

export const Modal = component<ModalProps>(
  ({ classNames, isOpen, content, onTapOutside }) => {
    return m.Dialog({
      onmount: (dialogElem) =>
        setTimeout(() =>
          effect(() => {
            if (isOpen.value) dialogElem.showModal();
            else dialogElem.close();
          })
        ),
      onclick: handleCTA(onTapOutside),
      class: dstring`pa0 br3 ${classNames}`,
      children: [
        m.Div({
          onclick: (e: Event) => e.stopPropagation(),
          children: content,
        }),
      ],
    });
  }
);
