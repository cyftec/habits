import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleCTA } from "../@common/utils";

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
      class: dstring`br3 pb1 f4 bw1 b--light-silver dark-gray ${() =>
        hideRemove?.value && hideAdd?.value ? "bn" : "ba"} ${classNames}`,
      children: [
        m.If({
          subject: hideRemove,
          isFalsy: m.Span({
            class: dstring`pointer ph2 pb1 bw1 b--light-silver ${() =>
              hideAdd?.value ? "" : "br"}`,
            onclick: handleCTA(onRemove),
            children: "-",
          }),
        }),
        m.If({
          subject: hideAdd,
          isFalsy: m.Span({
            class: "pointer ph2 pb1",
            onclick: handleCTA(onAdd),
            children: "+",
          }),
        }),
      ],
    });
  }
);
