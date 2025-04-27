import { dstring } from "@cyftech/signal";
import { component, type DomEventValue, m } from "@mufw/maya";

type NumberBoxProps = {
  classNames?: string;
  placeholder?: string;
  num: number;
  onchange: (value: number) => void;
};

export const NumberBox = component<NumberBoxProps>(
  ({ classNames, placeholder, num, onchange }) => {
    const onTextChange = (e: KeyboardEvent) => {
      const text = (e.target as HTMLInputElement).value;
      const numValue = Number.parseFloat(
        Number.parseFloat(text || "0").toFixed(2)
      );
      onchange(numValue);
    };

    return m.Input({
      class: classNames,
      type: "number",
      placeholder,
      value: dstring`${() => num.value ?? ""}`,
      onchange: onTextChange as DomEventValue,
    });
  }
);
