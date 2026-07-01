import { useNavigate } from "react-router-dom";
import { getPets, getSelectedPetId } from "../../services/storage";
import PetProfileCard from "../../components/PetProfileCard/PetProfileCard";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import { FaArrowLeft, FaTasks, FaCalendarAlt, FaEdit } from "react-icons/fa";
import { useTranslation } from "../../i18n/useTranslation";
import "./PetProfile.css";

function PetProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pets = getPets();
  const selectedPetId = getSelectedPetId();
  const pet = pets.find((p) => p.id === selectedPetId);

  if (!pet) {
    return (
      <div className="pet-profile-page">
        <p>{t("petProfile.noPet")}</p>
        <button
          type="button"
          className="pet-profile__btn"
          onClick={() => navigate("/")}
        >
          {t("petProfile.goToPets")}
        </button>
        <BottomMenu />
      </div>
    );
  }

  return (
    <div className="pet-profile-page">
      <button
        type="button"
        className="pet-profile__back"
        onClick={() => navigate("/")}
      >
        <FaArrowLeft size={14} /> {t("petProfile.back")}
      </button>

      <PetProfileCard pet={pet} />

      <div className="pet-profile__actions">
        <button
          type="button"
          className="pet-profile__action"
          onClick={() => navigate("/home")}
        >
          <FaTasks /> {t("petProfile.tasks")}
        </button>
        <button
          type="button"
          className="pet-profile__action"
          onClick={() => navigate("/calendar")}
        >
          <FaCalendarAlt /> {t("petProfile.calendar")}
        </button>
        <button
          type="button"
          className="pet-profile__action"
          onClick={() => navigate("/edit-profile")}
        >
          <FaEdit /> {t("petProfile.edit")}
        </button>
      </div>

      <BottomMenu />
    </div>
  );
}

export default PetProfile;
