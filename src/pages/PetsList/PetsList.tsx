import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPets } from "../../services/storage";
import { generateScatterPositions } from "../../utils/scatter";
import PetOrb from "../../components/PetOrb/PetOrb";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import { useTranslation } from "../../i18n/useTranslation";
import "./PetsList.css";

function PetsList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [pets, setPets] = useState(() => getPets());

  const positions = useMemo(
    () => generateScatterPositions(pets.map((p) => p.id)),
    [pets]
  );

  const handleDeleted = (id: number) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="pets-scatter-page">
      <header className="pets-scatter-header">
        <h1 className="pets-scatter-title">{t("pets.title")}</h1>
      </header>

      {pets.length === 0 ? (
        <div className="pets-scatter-empty">
          <p>{t("pets.empty")}</p>
        </div>
      ) : (
        <div className="pets-scatter-field">
          {pets.map((pet) => {
            const pos = positions[pet.id];
            if (!pos) return null;
            return (
              <PetOrb
                key={pet.id}
                pet={pet}
                x={pos.x}
                y={pos.y}
                size={pos.size}
                rotate={pos.rotate}
                onDeleted={handleDeleted}
              />
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="pets-scatter-addBtn"
        onClick={() => navigate("/create-pet")}
      >
        {t("pets.addPet")}
      </button>

      <BottomMenu />
    </div>
  );
}

export default PetsList;
