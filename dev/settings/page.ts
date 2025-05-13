import { dobject, dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { INITIAL_SETTINGS, INITIAL_STORAGE_DATA } from "../@common/constants";
import {
  getEditPageSettings,
  getStorageData,
  updateEditPageSettings,
} from "../@common/localstorage";
import { StorageDetails } from "../@common/types";
import { goToPrivacyPolicyPage } from "../@common/utils";
import { NavScaffold, HTMLPage, Section } from "../@components";
import { Divider, Icon, Link } from "../@elements";
import { ToggleSetting } from "./@components/ToggleSetting";

const editPageSettings = signal(INITIAL_SETTINGS.editPage);
const storageSpace = signal<StorageDetails>(INITIAL_STORAGE_DATA);
const storageSpaceLabel = dstring`${() =>
  storageSpace.value.total?.toFixed(2)} KB used (${() =>
  storageSpace.value.spaceLeft?.toFixed(2)}% left)`;

const onEditPageHintsSettingToggle = () => {
  updateEditPageSettings({
    ...editPageSettings.value,
    showHints: !editPageSettings.value.showHints,
  });
  editPageSettings.value = getEditPageSettings();
};

const onEditPageCustomisationsSettingToggle = () => {
  updateEditPageSettings({
    ...editPageSettings.value,
    showFullCustomisation: !editPageSettings.value.showFullCustomisation,
  });
  editPageSettings.value = getEditPageSettings();
};

const onPageMount = () => {
  storageSpace.value = getStorageData();
  editPageSettings.value = getEditPageSettings();
};

export default HTMLPage({
  classNames: "bg-white",
  onMount: onPageMount,
  body: NavScaffold({
    classNames: "ph3 bg-white",
    route: "/settings/",
    header: "Settings",
    content: m.Div({
      children: [
        Section({
          classNames: "pb3",
          title: "Storage space",
          children: storageSpaceLabel,
        }),
        Section({
          classNames: "pb3",
          title: "Preferences",
          children: [
            Divider({ classNames: "mv2" }),
            ToggleSetting({
              label: "Show hints on Edit page",
              isToggleOn: dobject(editPageSettings).prop("showHints"),
              onToggle: onEditPageHintsSettingToggle,
            }),
            Divider({ classNames: "mv2" }),
            ToggleSetting({
              label: "Always show more customisations on Edit page",
              isToggleOn: dobject(editPageSettings).prop(
                "showFullCustomisation"
              ),
              onToggle: onEditPageCustomisationsSettingToggle,
            }),
            Divider({ classNames: "mv2" }),
          ],
        }),
        Section({
          classNames: "pb3",
          title: "Privacy Policy",
          description: `
            This app does not collect any data, nor does it store
            them remotely or send elsewhere for data persistence.
            It uses local storage of the browser for saving data. And it is safe
            for use by any age group person.`,
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
            m.Div([
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
            ]),
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
  }),
});
