import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type AddRemoveButtonProps = {
  classNames?: string;
  hideRemove?: boolean;
  hideAdd?: boolean;
  onRemove: () => void;
  onAdd: () => void;
};

export const AddRemoveButton = component<AddRemoveButtonProps>(
  ({ classNames, hideRemove, hideAdd, onRemove, onAdd }) => {
    return m.Span({
      class: dstring`br3 pb1 f4 ba bw1 b--light-silver dark-gray ${classNames}`,
      children: [
        m.If({
          subject: hideRemove,
          isFalsy: m.Span({
            class: "pointer ph2 pb1 br bw1 b--light-silver",
            onclick: onRemove,
            children: "-",
          }),
        }),
        m.If({
          subject: hideAdd,
          isFalsy: m.Span({
            class: "pointer ph2 pb1",
            onclick: onAdd,
            children: "+",
          }),
        }),
      ],
    });
  }
);
