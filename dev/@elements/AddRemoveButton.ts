import { compute, derive, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleTap } from "../@common/utils";

type AddRemoveButtonProps = {
  classNames?: string;
  hideRemove?: boolean;
  hideAdd?: boolean;
  onRemove: () => void;
  onAdd: () => void;
};

export const AddRemoveButton = component<AddRemoveButtonProps>(
  ({ classNames, hideRemove, hideAdd, onRemove, onAdd }) => {
    const containerBorderCss = derive(() =>
      hideRemove?.value && hideAdd?.value ? "bn" : "ba"
    );
    const removeBtnBorderCss = compute(hideAdd).oneOf("", "br");

    return m.Span({
      class: dstring`br3 pb1 f4 bw1 b--light-silver dark-gray ${containerBorderCss} ${classNames}`,
      children: [
        m.If({
          subject: hideRemove,
          isFalsy: m.Span({
            class: dstring`pointer ph2 pb1 bw1 b--light-silver ${removeBtnBorderCss}`,
            onclick: handleTap(onRemove),
            children: "-",
          }),
        }),
        m.If({
          subject: hideAdd,
          isFalsy: m.Span({
            class: "pointer ph2 pb1",
            onclick: handleTap(onAdd),
            children: "+",
          }),
        }),
      ],
    });
  }
);
