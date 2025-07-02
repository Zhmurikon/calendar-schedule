import { Plugin } from "obsidian";
import { CalendarView } from "./calendarView";
import { CalendarScheduleSettingTab, DEFAULT_SETTINGS, CalendarScheduleSettings } from "./settings";

export default class CalendarSchedulePlugin extends Plugin {
  settings: CalendarScheduleSettings;

  async onload() {
    console.log("Загрузка Calendar Schedule плагина");

    await this.loadSettings();

    this.addRibbonIcon("calendar", "Открыть календарь", () => {
      this.activateView();
    });

    this.addSettingTab(new CalendarScheduleSettingTab(this.app, this));

    this.registerView(CalendarView.VIEW_TYPE, (leaf) => new CalendarView(leaf, this));
  }

  async activateView() {
    const leaf = this.app.workspace.getLeaf(true);  // true — означает: использовать центральное пространство
    await leaf.setViewState({ type: CalendarView.VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
