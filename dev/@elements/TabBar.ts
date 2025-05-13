import { derive, dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleTap } from "../@common/utils";

type TabBarProps = {
  classNames?: string;
  tabItemClassNames?: string;
  selectedTabClassNames?: string;
  tabs: string[];
  selectedTabIndex: number;
  onTabChange: (tabIndex: number) => void;
};

export const TabBar = component<TabBarProps>(
  ({
    classNames,
    tabItemClassNames,
    selectedTabClassNames,
    tabs,
    selectedTabIndex,
    onTabChange,
  }) => {
    const tabSelectionCss = (tabIndex: number) =>
      tabIndex === selectedTabIndex.value
        ? `b--light-silver b black ${selectedTabClassNames?.value}`
        : "pointer b--transparent b--hover-black silver pointer";

    return m.Div({
      class: dstring`bg-white br3 ${classNames}`,
      children: m.Div({
        class: "flex items-center justify-between pa1",
        children: m.For({
          subject: tabs,
          map: (tab, i) =>
            m.Span({
              class: dstring`
                w-100 br3 pv3 ph2 flex justify-center noselect br-pill ba bw1 bg-inherit
                ${tabSelectionCss(i)} ${tabItemClassNames}`,
              onclick: handleTap(() => onTabChange(i)),
              children: tab,
            }),
        }),
      }),
    });
  }
);
