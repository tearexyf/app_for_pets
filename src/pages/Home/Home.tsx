import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PetCard from "../../components/PetCard/PetCard";
import {
  getPets,
  getSelectedPetId,
  getTasks,
  toggleTaskCompleted,
} from "../../services/storage";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import { FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "../../i18n/useTranslation";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pets = getPets();
  const selectedPetId = getSelectedPetId();
  const pet = pets.find((p) => p.id === selectedPetId);

  const [tasks, setTasks] = useState(() =>
    getTasks().filter((task) => task.petId === selectedPetId)
  );

  const completedTasks = tasks.filter((task) => task.completed).length;
  const todayTasks = tasks.filter((task) => {
    const today = new Date().toISOString().split("T")[0];
    return task.date === today;
  }).length;

  const completeTask = (id: number) => {
    toggleTaskCompleted(id);
    setTasks(getTasks().filter((task) => task.petId === selectedPetId));
  };

  if (!pet) {
    return (
      <div className="tasks-container">
        <p>{t("home.noPet")}</p>
        <button
          type="button"
          className="tasks__btn"
          onClick={() => navigate("/")}
        >
          {t("home.goToPets")}
        </button>
        <BottomMenu />
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <button
        type="button"
        className="tasks__back"
        onClick={() => navigate("/")}
      >
        <FaArrowLeft size={14} /> {t("home.back")}
      </button>

      <PetCard pet={pet} />

      <div className="stats">
        <div>
          <h3>{tasks.length}</h3>
          <p>{t("home.tasksStat")}</p>
        </div>
        <div>
          <h3>{completedTasks}</h3>
          <p>{t("home.doneStat")}</p>
        </div>
        <div>
          <h3>{todayTasks}</h3>
          <p>{t("home.todayStat")}</p>
        </div>
      </div>

      <h2 className="tasks__title">{t("home.tasksTitle")}</h2>

      {tasks.length === 0 ? (
        <p>{t("home.noTasks")}</p>
      ) : (
        tasks
          .slice()
          .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
          .map((task) => (
            <div className="task" key={task.id}>
              <h3 className="task__title">{task.title}</h3>
              <p className="task__p">{task.date}</p>
              <p className="task__p">{task.time}</p>
              {task.description && <p className="task__p">{task.description}</p>}
              <label>
                <input
                  className="task__input"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => completeTask(task.id)}
                />
              </label>
            </div>
          ))
      )}

      <button
        type="button"
        className="tasks__btn"
        onClick={() => navigate("/create-task")}
      >
        {t("home.addTask")}
      </button>
      <BottomMenu />
    </div>
  );
}

export default Home;
