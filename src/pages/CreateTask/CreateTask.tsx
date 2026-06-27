import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPets, getSelectedPetId, saveTask } from "../../services/storage";
import type { TaskType } from "../../types/Task";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import { useTranslation } from "../../i18n/useTranslation";
import type { TranslationKey } from "../../i18n/translations";
import "./CreateTask.css";

const TYPE_OPTIONS: { value: TaskType; labelKey: TranslationKey }[] = [
  { value: "med", labelKey: "task.type.pill" },
  { value: "vet", labelKey: "task.type.vet" },
  { value: "procedure1", labelKey: "task.type.ears" },
  { value: "procedure2", labelKey: "task.type.eyes" },
  { value: "procedure3", labelKey: "task.type.teeth" },
  { value: "procedure4", labelKey: "task.type.fur" },
];

function CreateTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useTranslation();
  const pets = getPets();
  const presetDate = (location.state as { date?: string } | null)?.date;

  const [petId, setPetId] = useState<number>(getSelectedPetId() || pets[0]?.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(presetDate || "");
  const [time, setTime] = useState("");
  const [type, setType] = useState<TaskType>("med");
  const [error, setError] = useState("");

  const typeOptions = useMemo(
    () =>
      TYPE_OPTIONS.map((option) => ({
        ...option,
        label: t(option.labelKey),
      })),
    [language, t]
  );

  const handleSave = () => {
    if (!petId) {
      setError(t("task.needPet"));
      return;
    }
    if (!title.trim() || !date || !time) {
      setError(t("task.fillRequired"));
      return;
    }

    saveTask({
      id: Date.now(),
      petId,
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      type,
      completed: false,
    });

    navigate(-1);
  };

  if (pets.length === 0) {
    return (
      <div className="taskCard">
        <h1 className="task__title">{t("task.new")}</h1>
        <p>{t("task.addPetFirst")}</p>
        <button
          type="button"
          className="task__btn"
          onClick={() => navigate("/create-pet")}
        >
          {t("task.addPet")}
        </button>
      </div>
    );
  }

  return (
    <div className="taskCard">
      <h1 className="task__title">{t("task.new")}</h1>

      <label className="task__label">
        {t("task.pet")}
        <select
          className="task__select"
          value={petId}
          onChange={(e) => setPetId(Number(e.target.value))}
        >
          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <label className="task__label">
        {t("task.title")}
        <input
          className="task__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="task__label">
        {t("task.description")}
        <input
          className="task__input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="task__label">
        {t("task.date")}
        <input
          className="task__input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label className="task__label">
        {t("task.time")}
        <input
          className="task__input"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </label>

      <label className="task__label">
        {t("task.type")}
        <select
          className="task__select"
          value={type}
          onChange={(e) => setType(e.target.value as TaskType)}
        >
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="task__error">{error}</p>}

      <button type="button" className="task__btn" onClick={handleSave}>
        {t("task.save")}
      </button>
      <BottomMenu />
    </div>
  );
}

export default CreateTask;
