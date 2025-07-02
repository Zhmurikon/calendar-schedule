import { ItemView, WorkspaceLeaf } from "obsidian";
import CalendarSchedulePlugin from "./main";

export class CalendarView extends ItemView {
  static VIEW_TYPE = "calendar-schedule-view";
  plugin: CalendarSchedulePlugin;


  isSelecting = false;
  selectionDay: string | null = null;
  startCell: HTMLElement | null = null;
  endCell: HTMLElement | null = null;


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


  highlightSelection() {
    const cells = Array.from(document.querySelectorAll(".slot-cell")) as HTMLElement[];

    cells.forEach(cell => cell.classList.remove("selected"));

    if (!this.startCell || !this.endCell) return;

    const day = this.startCell.dataset.day;
    const allDayCells = cells.filter(c => c.dataset.day === day);

    const startIndex = allDayCells.indexOf(this.startCell);
    const endIndex = allDayCells.indexOf(this.endCell);

    const [min, max] = [startIndex, endIndex].sort((a, b) => a - b);

    for (let i = min; i <= max; i++) {
      allDayCells[i].classList.add("selected");
    }
  }


  /**
   * Рендерит базовую сетку: дни по горизонтали, часы по вертикали
   */
  renderCalendarGrid(container: HTMLElement) {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      return date;
    });
    const hours = Array.from({ length: 25 }, (_, i) => `${i}:00`);

    const grid = container.createDiv({ cls: "calendar-schedule-grid" });

    const headerRow = grid.createDiv({ cls: "calendar-schedule-row header-row" });
    headerRow.createDiv({ cls: "calendar-schedule-cell time-cell" });

    days.forEach((date, dayIndex) => {
      const dayName = date.toLocaleDateString("ru-RU", { weekday: "short" });
      const dayNumber = date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });

      const dayCell = headerRow.createDiv({ cls: "calendar-schedule-cell day-cell" });
      dayCell.createSpan({ text: dayName });
      dayCell.createEl("br");
      dayCell.createSpan({ text: dayNumber });
    });

    // Генерация 15-минутных ячеек
    hours.forEach(hour => {
      for (let quarter = 0; quarter < 4; quarter++) {
        const row = grid.createDiv({ cls: "calendar-schedule-row" });

        if (quarter === 0) {
          row.createDiv({ cls: "calendar-schedule-cell time-cell", text: hour });
        } else {
          row.createDiv({ cls: "calendar-schedule-cell time-cell" });
        }

        days.forEach((_, dayIndex) => {
          const cell = row.createDiv({ cls: "calendar-schedule-cell slot-cell" });
          cell.dataset.day = dayIndex.toString();
          cell.dataset.hour = hour;
          cell.dataset.quarter = quarter.toString();
        });
      }
    });

    // === ОБРАБОТЧИКИ ВЫДЕЛЕНИЯ ===

    container.addEventListener("mousedown", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("slot-cell")) {
        this.isSelecting = true;
        this.selectionDay = target.dataset.day!;
        this.startCell = target;
        this.endCell = target;

        target.classList.add("selected");
      }
    });

    container.addEventListener("mouseover", (e) => {
      if (!this.isSelecting) return;

      const target = e.target as HTMLElement;
      if (target.classList.contains("slot-cell") && target.dataset.day === this.selectionDay) {
        this.endCell = target;
        this.highlightSelection();
      }
    });

    container.addEventListener("mouseup", () => {
      if (this.isSelecting) {
        this.isSelecting = false;
        this.selectionDay = null;
        this.startCell = null;
        this.endCell = null;

        // Здесь потом будет создание окна задачи
      }
    });
  }

}
