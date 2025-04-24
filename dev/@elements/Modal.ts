import { dstring, effect } from "@cyftech/signal";
import { type Children, component, m } from "@mufw/maya";

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
      onclick: onTapOutside,
      class: dstring`pa0 br3 b--gray ${classNames}`,
      children: [
        m.Div({
          class: dstring``,
          onclick: (e: Event) => e.stopPropagation(),
          children: content,
        }),
      ],
    });
  }
);
