import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Pet } from "../../types/Pet";
import { setSelectedPetId, deletePet, getTasksForPet } from "../../services/storage";
import { FaUser, FaTasks, FaCalendarAlt, FaTrash, FaPaw, FaImages } from "react-icons/fa";
import { useTranslation } from "../../i18n/useTranslation";
import "./PetOrb.css";

export interface PetOrbProps {
  pet: Pet;
  x: number;
  y: number;
  size: number;
  rotate: number;
  onDeleted: (id: number) => void;
}

type PetalAction = "profile" | "tasks" | "gallery" | "calendar" | "delete";

function PetOrb({ pet, x, y, size, rotate, onDeleted }: PetOrbProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const petals = useMemo(
    () => [
      {
        key: "profile",
        label: t("petOrb.profile"),
        icon: <FaUser />,
        angle: -80,
        action: "profile" as PetalAction,
      },
      {
        key: "tasks",
        label: t("petOrb.tasks"),
        icon: <FaTasks />,
        angle: -40,
        action: "tasks" as PetalAction,
      },
      {
        key: "gallery",
        label: t("petOrb.gallery"),
        icon: <FaImages />,
        angle: 0,
        action: "gallery" as PetalAction,
      },
      {
        key: "calendar",
        label: t("petOrb.calendar"),
        icon: <FaCalendarAlt />,
        angle: 40,
        action: "calendar" as PetalAction,
      },
      {
        key: "delete",
        label: t("petOrb.delete"),
        icon: <FaTrash />,
        angle: 180,
        action: "delete" as PetalAction,
      },
    ],
    [language, t]
  );

  const taskCount = getTasksForPet(pet.id).filter((task) => !task.completed).length;

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  const selectAndGo = (path: string) => {
    setSelectedPetId(pet.id);
    navigate(path);
  };

  const handleOrbClick = () => {
    if (!open) {
      setOpen(true);
      return;
    }
    selectAndGo("/pet-profile");
  };

  const handlePetal = (action: PetalAction) => {
    setOpen(true);
    if (action === "profile") selectAndGo("/pet-profile");
    if (action === "tasks") selectAndGo("/home");
    if (action === "gallery") selectAndGo(`/gallery/${pet.id}`);
    if (action === "calendar") selectAndGo("/calendar");
    if (action === "delete") {
      const ok = window.confirm(t("petOrb.deleteConfirm", { name: pet.name }));
      if (ok) {
        deletePet(pet.id);
        onDeleted(pet.id);
      }
    }
  };

  const petalRadius = size / 2 + 46;

  return (
    <div
      ref={rootRef}
      className={`pet-orb-wrap ${open ? "pet-orb-wrap--open" : ""}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {petals.map((petal) => {
        const rad = (petal.angle * Math.PI) / 180;
        const px = Math.sin(rad) * petalRadius;
        const py = -Math.cos(rad) * petalRadius;
        return (
          <button
            key={petal.key}
            type="button"
            className={`pet-orb__petal pet-orb__petal--${petal.action}`}
            style={{
              transform: open
                ? `translate(${px}px, ${py}px) scale(1)`
                : "translate(0, 0) scale(0.4)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handlePetal(petal.action);
            }}
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
          >
            <span className="pet-orb__petal-icon">{petal.icon}</span>
            <span className="pet-orb__petal-label">{petal.label}</span>
          </button>
        );
      })}

      <button
        type="button"
        className="pet-orb"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `rotate(${open ? 0 : rotate}deg)`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleOrbClick();
        }}
      >
        {pet.photo ? (
          <img className="pet-orb__photo" src={pet.photo} alt={pet.name} />
        ) : (
          <span className="pet-orb__placeholder">
            <FaPaw />
          </span>
        )}
        {taskCount > 0 && <span className="pet-orb__badge">{taskCount}</span>}
        <span className="pet-orb__name">{pet.name}</span>
      </button>
    </div>
  );
}

export default PetOrb;
