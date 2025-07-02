import { App, PluginSettingTab, Setting } from "obsidian";
import CalendarSchedulePlugin from "./main";

export interface CalendarScheduleSettings {
  timeFormat: string;
}

export const DEFAULT_SETTINGS: CalendarScheduleSettings = {
  timeFormat: "24h"
};

export class CalendarScheduleSettingTab extends PluginSettingTab {
  plugin: CalendarSchedulePlugin;

  constructor(app: App, plugin: CalendarSchedulePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Формат времени")
      .setDesc("12h или 24h")
      .addText(text =>
        text
          .setPlaceholder("24h")
          .setValue(this.plugin.settings.timeFormat)
          .onChange(async (value) => {
            this.plugin.settings.timeFormat = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
