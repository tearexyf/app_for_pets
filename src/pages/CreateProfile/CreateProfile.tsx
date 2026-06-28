import { useState } from "react";
import "./createProfile.css";
import { savePet } from "../../services/storage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../i18n/useTranslation";
import { useFormatWeight } from "../../hooks/useFormatWeight";
import { convertInputToStoredKg } from "../../utils/weight";

function CreateProfile() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [species, setSpecies] = useState("Cat");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("Female");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { weightLabel, unit } = useFormatWeight();

  const handleSavePet = () => {
    if (!name) {
      alert(t("create.nameRequired"));
      return;
    }
    const newPet = {
      id: Date.now(),
      name,
      photo,
      species,
      breed,
      birthDate,
      weight: convertInputToStoredKg(weight, unit),
      gender,
      notes,
    };
    savePet(newPet);
    navigate("/home");
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="create">
      <h1 className="create__title">{t("create.title")}</h1>
      <div className="add-photo">
        <label
          className="create__label"
          htmlFor="photo-upload"
          style={{ cursor: "pointer" }}
        >
          {photo ? (
            <img className="add-photo__img" src={photo} alt="pet" />
          ) : (
            <div className="add-photo__not-img"></div>
          )}
        </label>

        <input
          className="create__input"
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: "none" }}
        />
      </div>

      <label className="create__label">
        {t("create.name")}
        <input
          className="create__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="create__label">
        {t("create.species")}
        <select
          className="create__select"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
        >
          <option value="Cat">{t("create.species.cat")}</option>
          <option value="Dog">{t("create.species.dog")}</option>
          <option value="Rat">{t("create.species.rat")}</option>
        </select>
      </label>

      <label className="create__label">
        {t("create.breed")}
        <input
          className="create__input"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />
      </label>

      <label className="create__label">
        {t("create.birthDate")}
        <input
          className="create__input"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </label>

      <label className="create__label">
        {t("create.weight")} ({weightLabel})
        <input
          className="create__input"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </label>

      <label className="create__label">
        {t("create.gender")}
        <select
          className="create__select"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="Male">{t("profile.gender.male")}</option>
          <option value="Female">{t("profile.gender.female")}</option>
        </select>
      </label>

      <label className="create__label">
        {t("create.notes")}
        <textarea
          id="create__textarea"
          className="create__textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </label>
      <button type="button" className="create__btn" onClick={handleSavePet}>
        {t("create.save")}
      </button>
    </div>
  );
}
export default CreateProfile;
