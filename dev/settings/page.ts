import { dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { phase } from "@mufw/maya/utils";
import { goToPrivacyPolicyPage } from "../@common/utils";
import { NavScaffold, Section } from "../@components";
import { Icon, Link, Page, Toggle } from "../@elements";

const space = signal<Record<string, number>>({});
const showHintsOnEditPageToggle = signal(true);
const showDefaultCustomizationLengthToggle = signal(false);

const getStorage = () => {
  if (!phase.currentIs("run")) return;
  const BYTES_PER_KB = 1024;
  let totalBytes = 0;
  const getKbFromBytes = (bytes: number) => bytes / BYTES_PER_KB;
  const collections = {
    total: 0,
  };
  for (const key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue;
    }
    const singleRecordBytes = (localStorage[key].length + key.length) * 2;
    totalBytes += singleRecordBytes;
    const recordKey = key.startsWith("h.") ? "habits" : key;
    collections[recordKey] =
      (collections[recordKey] ? collections[recordKey] : 0) + singleRecordBytes;
  }
  collections.total = getKbFromBytes(totalBytes);
  collections["spaceLeft"] =
    (100 * (5 * 1024 * 1024 - totalBytes)) / (5 * 1024 * 1024);
  console.log(collections);
  space.value = collections;
};

export default Page({
  classNames: "bg-white",
  onMount: getStorage,
  body: NavScaffold({
    classNames: "ph3 bg-white",
    route: "/settings/",
    header: "Settings",
    content: m.Div({
      children: [
        Section({
          classNames: "pb3",
          title: "Storage space",
          children: [
            dstring`${() => space.value.total?.toFixed(2)} KB used (${() =>
              space.value.spaceLeft?.toFixed(2)}% left)`,
          ],
        }),
        Section({
          classNames: "pb3",
          title: "Preferences",
          children: [
            m.Div({ class: "bb b--light-gray mv2" }),
            m.Div({
              class: "flex items-center justify-between",
              children: [
                m.Div("Show hints on Edit page"),
                Toggle({
                  isOn: showHintsOnEditPageToggle,
                  onToggle: () =>
                    (showHintsOnEditPageToggle.value =
                      !showHintsOnEditPageToggle.value),
                }),
              ],
            }),
            m.Div({ class: "bb b--light-gray mv2" }),
            m.Div({
              class: "flex items-center justify-between",
              children: [
                m.Div("Always show more customisations on Edit page"),
                Toggle({
                  isOn: showDefaultCustomizationLengthToggle,
                  onToggle: () =>
                    (showDefaultCustomizationLengthToggle.value =
                      !showDefaultCustomizationLengthToggle.value),
                }),
              ],
            }),
            m.Div({ class: "bb b--light-gray mv2" }),
          ],
        }),
        Section({
          classNames: "pb3",
          title: "Privacy Policy",
          description: `
            This app does not collect any data, nor does it store
            them remotely or send elsewhere for data persistence.
            It uses local storage of the browser for saving data. And it is safe
            for use by any age group person.
          `,
          children: Link({
            classNames: "flex items-center",
            onClick: goToPrivacyPolicyPage,
            children: [
              "Read complete policy here",
              Icon({
                className: "ml1",
                size: 12,
                iconName: "call_made",
              }),
            ],
          }),
        }),
        Section({
          contentClassNames: "flex justify-between",
          title: "About",
          children: [
            m.Div({
              class: "",
              children: [
                m.Div({
                  class: "",
                  children: "Habits (by Cyfer)",
                }),
                m.Div({
                  class: "silver mt1",
                  children: "version 1.0",
                }),
                m.Div({
                  class: "silver mt1 flex items-center",
                  children: [
                    "Made with",
                    Icon({
                      className: "mh1 gray",
                      size: 21,
                      iconName: "volunteer_activism",
                    }),
                    "from Bharat",
                  ],
                }),
              ],
            }),
            m.Div({
              class: "pa05 h3 bg-green ba b--blue relative",
              children: [
                m.Div({
                  class: "absolute top-0 left-0 right-0 bg-white",
                  style: "height: 66.6%;",
                }),
                m.Div({
                  class: "absolute top-0 left-0 right-0 bg-orange",
                  style: "height: 33.3%;",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // navbarTop: AddHabitButton({}),
  }),
});
