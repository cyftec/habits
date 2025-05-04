import { phase } from "@mufw/maya/utils";
import { INITIAL_SETTINGS } from "../constants";
import { LocalSettings } from "../types";
import { parseObjectJsonString } from "../utils";

export const updateSettings = (settings: LocalSettings) => {
  localStorage.setItem("settings", JSON.stringify(settings));
};

export const fetchSettings = () => {
  if (!phase.currentIs("run")) return INITIAL_SETTINGS;

  const getSettingsFromStore = () => {
    const settingsString = localStorage.getItem("settings");
    const settingsObject = parseObjectJsonString<LocalSettings>(
      settingsString,
      "id",
      "local-settings"
    );
    return settingsObject;
  };

  const settingsObject = getSettingsFromStore();
  if (!settingsObject) updateSettings(INITIAL_SETTINGS);
  const settings = getSettingsFromStore();
  if (!settings) throw `Error fetching settings`;

  return settings;
};
