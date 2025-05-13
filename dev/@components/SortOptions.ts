import { component, m } from "@mufw/maya";
import { Icon, Modal } from "../@elements";
import { derive, dobject, dstring, signal } from "@cyftech/signal";
import { HOMEPAGE_SORT_OPTIONS } from "../@common/constants";
import { handleTap } from "../@common/utils";

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

    const openModal = () => (isSortingOptionsModalOpen.value = true);
    const closeModal = () => (isSortingOptionsModalOpen.value = false);

    const getOptionCss = (optionLabel: string) =>
      optionLabel === selectedOption.value.label
        ? "bg-near-white black fw6"
        : "gray fw5";

    const onOptionTap = (optionIndex: number) => {
      onChange(optionIndex);
      closeModal();
    };

    return m.Div({
      class: classNames,
      children: [
        SortIcon({
          classNames: "pointer",
          descending: dobject(selectedOption).prop("decending"),
          iconName: dobject(selectedOption).prop("icon"),
          size: derive(() => iconSize?.value ?? 20),
          onClick: openModal,
        }),
        Modal({
          classNames: "f5 normal ba bw0 outline-0",
          isOpen: isSortingOptionsModalOpen,
          onTapOutside: closeModal,
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
                  map: (option, optionIndex) =>
                    m.Div({
                      class: dstring`pointer flex items-center pv3 pl2 pr3 bt b--moon-gray ${() =>
                        getOptionCss(option.label)}`,
                      onclick: handleTap(() => onOptionTap(optionIndex)),
                      children: [
                        SortIcon({
                          classNames: "ml1 mr2",
                          descending: option.decending,
                          iconName: option.icon,
                          size: 20,
                        }),
                        m.Span(option.label),
                      ],
                    }),
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
    const pointerCss = derive(() => (onClick ? "pointer" : ""));
    const arrowIconName = derive(() =>
      descending.value ? "arrow_upward" : "arrow_downward"
    );
    const arrowIconSize = derive(() => (4 * size.value) / 5);

    return m.Span({
      class: dstring`flex items-center ${pointerCss} ${classNames}`,
      onclick: handleTap(onClick),
      children: [
        Icon({
          className: "silver",
          iconName: arrowIconName,
          size: arrowIconSize,
        }),
        Icon({
          size: size,
          iconName: iconName,
        }),
      ],
    });
  }
);
