import { ItemView, WorkspaceLeaf } from "obsidian";
import CalendarSchedulePlugin from "./main";

export class CalendarView extends ItemView {
  static VIEW_TYPE = "calendar-schedule-view";
  plugin: CalendarSchedulePlugin;

  constructor(leaf: WorkspaceLeaf, plugin: CalendarSchedulePlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return CalendarView.VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Календарь";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();

    // Основной контейнер
    const root = container.createDiv({ cls: "calendar-schedule-root" });

    // Боковое меню (сейчас пустое)
    const sidebar = root.createDiv({ cls: "calendar-schedule-sidebar" });
    sidebar.setText("Меню (в разработке)");

    // Контейнер для сетки календаря
    const calendarContainer = root.createDiv({ cls: "calendar-schedule-calendar" });

    this.renderCalendarGrid(calendarContainer);
  }

  async onClose() {
    // Тут можно очищать слушатели событий или другие ресурсы
  }

  /**
   * Рендерит базовую сетку: дни по горизонтали, часы по вертикали
   */
  renderCalendarGrid(container: HTMLElement) {
    const now = new Date();

    // Генерация массива дат для недели, начиная с сегодняшнего дня
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      return date;
    });

    // Массив часов от 0 до 24
    const hours = Array.from({ length: 25 }, (_, i) => `${i}:00`);

    const grid = container.createDiv({ cls: "calendar-schedule-grid" });

    // Верхняя строка — заголовки дней
    const headerRow = grid.createDiv({ cls: "calendar-schedule-row header-row" });
    headerRow.createDiv({ cls: "calendar-schedule-cell time-cell" }); // Пустая ячейка слева

    days.forEach(date => {
      const dayName = date.toLocaleDateString("ru-RU", { weekday: "short" }); // Пн, Вт и т.п.
      const dayNumber = date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }); // 03.07

      headerRow.createDiv({
        cls: "calendar-schedule-cell day-cell",
        text: `${dayName} ${dayNumber}`
      });
    });

    // Строки по часам
    hours.forEach(hour => {
      const row = grid.createDiv({ cls: "calendar-schedule-row" });

      // Первый столбец — время
      row.createDiv({ cls: "calendar-schedule-cell time-cell", text: hour });

      // Ячейки по дням
      days.forEach(() => {
        row.createDiv({ cls: "calendar-schedule-cell slot-cell" });
      });
    });
  }

}
