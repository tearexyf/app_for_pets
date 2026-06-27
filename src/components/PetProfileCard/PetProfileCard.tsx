import "./petProfileCard.css";
import type { Pet } from "../../types/Pet";
import { FaPaw } from "react-icons/fa";
import { useTranslation } from "../../i18n/useTranslation";
import { useFormatWeight } from "../../hooks/useFormatWeight";

export interface PetProfileCardProps {
  pet: Pet;
}

function calcAge(birthDate: string, t: ReturnType<typeof useTranslation>["t"]): string {
  if (!birthDate) return "";
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return "";
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years <= 0) return t("profile.ageMonths", { count: months });
  if (years === 1) return t("profile.ageYears", { count: years });
  return t("profile.ageYearsPlural", { count: years });
}

function translateGender(gender: string, t: ReturnType<typeof useTranslation>["t"]) {
  if (gender === "Male") return t("profile.gender.male");
  if (gender === "Female") return t("profile.gender.female");
  return gender;
}

function PetProfileCard({ pet }: PetProfileCardProps) {
  const { t } = useTranslation();
  const { formatWeight } = useFormatWeight();
  const age = calcAge(pet.birthDate, t);

  return (
    <div className="card">
      {pet.photo ? (
        <img className="card__photo" src={pet.photo} alt={pet.name} />
      ) : (
        <div className="card__photo card__photo--placeholder">
          <FaPaw size={48} />
        </div>
      )}
      <h2 className="card__name">{pet.name}</h2>

      <div className="card__grid">
        {pet.species && (
          <div className="card__field">
            <span className="card__label">{t("profile.species")}</span>
            <span className="card__value">{pet.species}</span>
          </div>
        )}
        {pet.breed && (
          <div className="card__field">
            <span className="card__label">{t("profile.breed")}</span>
            <span className="card__value">{pet.breed}</span>
          </div>
        )}
        {age && (
          <div className="card__field">
            <span className="card__label">{t("profile.age")}</span>
            <span className="card__value">{age}</span>
          </div>
        )}
        {pet.weight && (
          <div className="card__field">
            <span className="card__label">{t("profile.weight")}</span>
            <span className="card__value">{formatWeight(pet.weight)}</span>
          </div>
        )}
        {pet.gender && (
          <div className="card__field">
            <span className="card__label">{t("profile.gender")}</span>
            <span className="card__value">{translateGender(pet.gender, t)}</span>
          </div>
        )}
        {pet.color && (
          <div className="card__field">
            <span className="card__label">{t("profile.color")}</span>
            <span className="card__value">{pet.color}</span>
          </div>
        )}
      </div>

      {pet.notes && <p className="card__notes">{pet.notes}</p>}
    </div>
  );
}

export default PetProfileCard;
