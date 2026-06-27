import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPets,
  getTasks,
  toggleTaskCompleted,
  deleteTask,
} from "../../services/storage";
import type { Task } from "../../types/Task";
import { FaChevronLeft, FaChevronRight, FaTrash, FaPlus } from "react-icons/fa";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import { useTranslation } from "../../i18n/useTranslation";
import { useSettingsStore } from "../../store/settingsStore";
import "./Calendar.css";

const WEEKDAY_KEYS = [
  "calendar.week.mon",
  "calendar.week.tue",
  "calendar.week.wed",
  "calendar.week.thu",
  "calendar.week.fri",
  "calendar.week.sat",
  "calendar.week.sun",
] as const;

const TYPE_COLORS: Record<string, string> = {
  med: "#e9967a",
  vet: "#7aa6e9",
  procedure1: "#9ad19a",
  procedure2: "#e9c46a",
  procedure3: "#c08cd1",
  procedure4: "#e98ca6",
};

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const firstOfMonth = new Date(year, month, 1);

  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function Calendar() {
  const navigate = useNavigate();
  const { t, locale } = useTranslation();
  const accentColor = useSettingsStore((state) => state.settings.accentColor);
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<string>(formatDateKey(today));

  const pets = useMemo(() => getPets(), []);
  const petNameById = useMemo(() => {
    const map = new Map<number, string>();
    pets.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [pets]);

  const [tasks, setTasks] = useState<Task[]>(() => getTasks());

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const list = map.get(task.date) || [];
      list.push(task);
      map.set(task.date, list);
    });
    return map;
  }, [tasks]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const monthLabel = useMemo(
    () =>
      new Date(year, month, 1).toLocaleDateString(locale, {
        month: "long",
        year: "numeric",
      }),
    [locale, month, year]
  );

  const selectedDateLabel = useMemo(
    () =>
      new Date(selectedDate).toLocaleDateString(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [locale, selectedDate]
  );

  const weekdays = WEEKDAY_KEYS.map((key) => t(key));

  const goPrevMonth = () => setCursor(new Date(year, month - 1, 1));
  const goNextMonth = () => setCursor(new Date(year, month + 1, 1));
  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(formatDateKey(today));
  };

  const selectedTasks = (tasksByDate.get(selectedDate) || []).sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  const handleToggle = (id: number) => {
    toggleTaskCompleted(id);
    setTasks(getTasks());
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
    setTasks(getTasks());
  };

  const todayKey = formatDateKey(today);

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <h1 className="calendar-title">{t("calendar.title")}</h1>
      </header>

      <div className="calendar-month-nav">
        <button
          type="button"
          className="calendar-nav-btn"
          onClick={goPrevMonth}
          aria-label={t("calendar.prevMonth")}
        >
          <FaChevronLeft />
        </button>
        <button type="button" className="calendar-month-label" onClick={goToday}>
          {monthLabel}
        </button>
        <button
          type="button"
          className="calendar-nav-btn"
          onClick={goNextMonth}
          aria-label={t("calendar.nextMonth")}
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((date, i) => {
          if (!date) return <div key={i} className="calendar-cell calendar-cell--empty" />;
          const key = formatDateKey(date);
          const dayTasks = tasksByDate.get(key) || [];
          const isSelected = key === selectedDate;
          const isToday = key === todayKey;
          return (
            <button
              key={i}
              type="button"
              className={`calendar-cell ${isSelected ? "calendar-cell--selected" : ""} ${
                isToday ? "calendar-cell--today" : ""
              }`}
              onClick={() => setSelectedDate(key)}
            >
              <span className="calendar-cell__num">{date.getDate()}</span>
              {dayTasks.length > 0 && (
                <span className="calendar-cell__dots">
                  {dayTasks.slice(0, 3).map((task) => (
                    <span
                      key={task.id}
                      className="calendar-cell__dot"
                      style={{
                        background: TYPE_COLORS[task.type] || accentColor,
                      }}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="calendar-day-panel">
        <div className="calendar-day-panel__header">
          <h2>{selectedDateLabel}</h2>
          <button
            type="button"
            className="calendar-day-panel__add"
            onClick={() => navigate("/create-task", { state: { date: selectedDate } })}
          >
            <FaPlus size={12} /> {t("calendar.addTask")}
          </button>
        </div>

        {selectedTasks.length === 0 ? (
          <p className="calendar-day-panel__empty">{t("calendar.noTasks")}</p>
        ) : (
          <ul className="calendar-task-list">
            {selectedTasks.map((task) => (
              <li
                key={task.id}
                className={`calendar-task ${task.completed ? "calendar-task--done" : ""}`}
              >
                <span
                  className="calendar-task__dot"
                  style={{ background: TYPE_COLORS[task.type] || accentColor }}
                />
                <label className="calendar-task__main">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                  />
                  <span className="calendar-task__info">
                    <span className="calendar-task__title">{task.title}</span>
                    <span className="calendar-task__meta">
                      {task.time}
                      {petNameById.get(task.petId)
                        ? ` · ${petNameById.get(task.petId)}`
                        : ""}
                    </span>
                  </span>
                </label>
                <button
                  type="button"
                  className="calendar-task__delete"
                  onClick={() => handleDelete(task.id)}
                  aria-label={t("petOrb.delete")}
                >
                  <FaTrash size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BottomMenu />
    </div>
  );
}

export default Calendar;
