import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleCTA } from "../@common/utils";

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
    return m.Div({
      class: dstring`bg-white br3 ${classNames}`,
      children: m.Div({
        class: "flex items-center justify-between pa1",
        children: m.For({
          subject: tabs,
          map: (tab, i) =>
            m.Span({
              class: dstring`w-100 br3 pv3 ph2 flex justify-center noselect br-pill ba bw1 bg-inherit ${() =>
                i === selectedTabIndex.value
                  ? `b--light-silver b black ${selectedTabClassNames?.value}`
                  : "pointer b--transparent b--hover-black silver pointer"} ${tabItemClassNames}`,
              onclick: handleCTA(() => onTabChange(i)),
              children: tab,
            }),
        }),
      }),
    });
  }
);
