import { tmpl, effect } from "@cyftech/signal";
import { type Children, component, m } from "@mufw/maya";
import { handleTap } from "../@common/utils";

type ModalProps = {
  cssClasses?: string;
  isOpen: boolean;
  content: Children;
  onTapOutside?: () => void;
};

export const Modal = component<ModalProps>(
  ({ cssClasses, isOpen, content, onTapOutside }) => {
    const onDialogMount = (dialogElem) => {
      setTimeout(() =>
        effect(() => {
          if (isOpen.value) dialogElem.showModal();
          else dialogElem.close();
        })
      );
    };

    return m.Dialog({
      onmount: onDialogMount,
      onclick: handleTap(onTapOutside),
      class: tmpl`pa0 br3 ${cssClasses}`,
      children: [
        m.Div({
          onclick: (e: Event) => e.stopPropagation(),
          children: content,
        }),
      ],
    });
  }
);
