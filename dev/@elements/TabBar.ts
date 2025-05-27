import { tmpl } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { handleTap } from "../@common/utils";

type TabBarProps = {
  cssClasses?: string;
  tabItemCssClasses?: string;
  selectedTabCssClasses?: string;
  tabs: string[];
  selectedTabIndex: number;
  onTabChange: (tabIndex: number) => void;
};

export const TabBar = component<TabBarProps>(
  ({
    cssClasses,
    tabItemCssClasses,
    selectedTabCssClasses,
    tabs,
    selectedTabIndex,
    onTabChange,
  }) => {
    const tabSelectionCss = (tabIndex: number) =>
      tabIndex === selectedTabIndex.value
        ? `b--light-silver b black ${selectedTabCssClasses?.value}`
        : "pointer b--transparent b--hover-black silver pointer";

    return m.Div({
      class: tmpl`bg-white br3 ${cssClasses}`,
      children: m.Div({
        class: "flex items-center justify-between pa1",
        children: m.For({
          subject: tabs,
          map: (tab, i) =>
            m.Span({
              class: tmpl`
                w-100 br3 pv2dot5 ph2 flex justify-center noselect br-pill ba bw1 bg-inherit
                ${tabSelectionCss(i)} ${tabItemCssClasses}`,
              onclick: handleTap(() => onTabChange(i)),
              children: tab,
            }),
        }),
      }),
    });
  }
);
