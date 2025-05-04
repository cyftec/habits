import { phase } from "@mufw/maya/utils";
import { INITIAL_SETTINGS } from "../constants";
import { LocalSettings } from "../types";
import { parseObjectJsonString } from "../utils";

const LS_SETTINGS_KEY = "settings";
const LS_SETTINGS_ID_KEY = "id";
const LS_SETTINGS_ID_VALUE = "local-settings";

export const updateSettings = (settings: LocalSettings) => {
  localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
};

export const fetchSettings = (): LocalSettings => {
  if (!phase.currentIs("run")) return INITIAL_SETTINGS;

  const getSettingsFromStore = () => {
    const settingsString = localStorage.getItem(LS_SETTINGS_KEY);
    const settingsObject = parseObjectJsonString<LocalSettings>(
      settingsString,
      LS_SETTINGS_ID_KEY,
      LS_SETTINGS_ID_VALUE
    );
    return settingsObject;
  };

  const settingsObject = getSettingsFromStore();
  if (!settingsObject) updateSettings(INITIAL_SETTINGS);
  const settings = getSettingsFromStore();
  if (!settings) throw `Error fetching settings`;

  return settings;
};
