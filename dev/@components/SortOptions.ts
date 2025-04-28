import { component, m } from "@mufw/maya";
import { Icon, Modal } from "../@elements";
import { derive, dstring, signal } from "@cyftech/signal";
import { HOMEPAGE_SORT_OPTIONS } from "../@common/constants";
import { vibrateOnTap } from "../@common/utils";

type SortOptionsProps = {
  classNames?: string;
  iconSize?: number;
  selectedOptionIndex: number;
  onChange: (optionIndex: number) => void;
};

export const SortOptions = component<SortOptionsProps>(
  ({ classNames, iconSize, selectedOptionIndex, onChange }) => {
    const isSortingOptionsModalOpen = signal(false);
    const selectedOption = derive(
      () => HOMEPAGE_SORT_OPTIONS[selectedOptionIndex.value]
    );

    const onOptionTap = (optionIndex: number) => {
      onChange(optionIndex);
      isSortingOptionsModalOpen.value = false;
    };

    return m.Div({
      class: classNames,
      children: [
        SortIcon({
          classNames: "pointer",
          descending: derive(() => selectedOption.value.decending),
          iconName: derive(() => selectedOption.value.icon),
          size: derive(() => iconSize?.value ?? 20),
          onClick: () => (isSortingOptionsModalOpen.value = true),
        }),
        Modal({
          classNames: "f5 normal ba bw0 outline-0",
          isOpen: isSortingOptionsModalOpen,
          onTapOutside: () => (isSortingOptionsModalOpen.value = false),
          content: m.Div({
            children: [
              m.Div({
                class: "f5 b tc pv3",
                children: "Sort habit cards by",
              }),
              m.Div({
                class: "f5 mb1",
                children: m.For({
                  subject: HOMEPAGE_SORT_OPTIONS,
                  map: (option, optionIndex) => {
                    const optionCSS = dstring`pointer flex items-center pv3 pl2 pr3 bt b--moon-gray ${() =>
                      option.label === selectedOption.value.label
                        ? "bg-near-white black"
                        : "gray"}`;

                    return m.Div({
                      class: optionCSS,
                      onclick: vibrateOnTap(() => onOptionTap(optionIndex)),
                      children: [
                        SortIcon({
                          classNames: "ml1 mr2",
                          descending: option.decending,
                          iconName: option.icon,
                          size: 20,
                        }),
                        m.Span(option.label),
                      ],
                    });
                  },
                }),
              }),
            ],
          }),
        }),
      ],
    });
  }
);

type SortIconProps = {
  classNames?: string;
  descending: boolean;
  iconName: string;
  size: number;
  onClick?: () => void;
};

const SortIcon = component<SortIconProps>(
  ({ classNames, descending, iconName, size, onClick }) => {
    return m.Span({
      class: dstring`flex items-center ${() =>
        onClick ? "pointer" : ""} ${classNames}`,
      onclick: vibrateOnTap(onClick),
      children: [
        Icon({
          className: "silver",
          size: derive(() => (4 * size.value) / 5),
          iconName: derive(() =>
            descending.value ? "arrow_upward" : "arrow_downward"
          ),
        }),
        Icon({
          className: "",
          size: size,
          iconName: iconName,
        }),
      ],
    });
  }
);
