import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPets,
  setSelectedPetId,
  getGalleryPhotosForPet,
  saveGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
} from "../../services/storage";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import { FaArrowLeft, FaCamera, FaTrash, FaPaw } from "react-icons/fa";
import { useTranslation } from "../../i18n/useTranslation";
import "./Gallery.css";

function PetGallery() {
  const navigate = useNavigate();
  const { petId } = useParams();
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const pets = getPets();
  const pet = pets.find((p) => p.id === Number(petId));

  useEffect(() => {
    if (pet) setSelectedPetId(pet.id);
  }, [pet]);

  const [photos, setPhotos] = useState(() =>
    pet ? getGalleryPhotosForPet(pet.id) : []
  );
  const [caption, setCaption] = useState("");
  const [pendingImage, setPendingImage] = useState("");

  const refresh = () => {
    if (pet) setPhotos(getGalleryPhotosForPet(pet.id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAdd = () => {
    if (!pet || !pendingImage) return;
    saveGalleryPhoto({
      id: Date.now(),
      petId: pet.id,
      image: pendingImage,
      caption: caption.trim(),
      createdAt: new Date().toISOString(),
    });
    setCaption("");
    setPendingImage("");
    refresh();
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm(t("gallery.deleteConfirm"));
    if (!ok) return;
    deleteGalleryPhoto(id);
    refresh();
  };

  const handleEditCaption = (id: number, current: string) => {
    const next = window.prompt(t("gallery.editCaption"), current);
    if (next === null) return;
    updateGalleryPhoto(id, { caption: next.trim() });
    refresh();
  };

  if (!pet) {
    return (
      <div className="gallery-page">
        <p>{t("gallery.petNotFound")}</p>
        <button
          type="button"
          className="gallery__btn"
          onClick={() => navigate("/gallery")}
        >
          {t("gallery.backToHub")}
        </button>
        <BottomMenu />
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <button
        type="button"
        className="gallery__back"
        onClick={() => navigate("/gallery")}
      >
        <FaArrowLeft size={14} /> {t("gallery.backToHub")}
      </button>

      <header className="gallery__header">
        <h1 className="gallery__title">{t("gallery.petTitle")}</h1>
        <div className="gallery__pet">
          {pet.photo ? (
            <img className="gallery__pet-photo" src={pet.photo} alt={pet.name} />
          ) : (
            <span className="gallery__pet-placeholder">
              <FaPaw />
            </span>
          )}
          <span className="gallery__pet-name">{pet.name}</span>
        </div>
      </header>

      <section className="gallery__add">
        <button
          type="button"
          className="gallery__upload"
          onClick={() => fileRef.current?.click()}
        >
          {pendingImage ? (
            <img className="gallery__upload-preview" src={pendingImage} alt="" />
          ) : (
            <>
              <FaCamera size={28} />
              <span>{t("gallery.addPhoto")}</span>
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="gallery__file-input"
          onChange={handleFileChange}
        />
        <input
          className="gallery__caption-input"
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={t("gallery.captionPlaceholder")}
        />
        <button
          type="button"
          className="gallery__btn"
          disabled={!pendingImage}
          onClick={handleAdd}
        >
          {t("gallery.save")}
        </button>
      </section>

      {photos.length === 0 ? (
        <p className="gallery__empty">{t("gallery.empty")}</p>
      ) : (
        <div className="gallery__grid">
          {photos
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((photo) => (
              <article key={photo.id} className="gallery__card">
                <div className="gallery__card-image-wrap">
                  <img
                    className="gallery__card-image"
                    src={photo.image}
                    alt={photo.caption || pet.name}
                  />
                  <button
                    type="button"
                    className="gallery__card-delete"
                    onClick={() => handleDelete(photo.id)}
                    aria-label={t("gallery.delete")}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
                {photo.caption ? (
                  <p
                    className="gallery__card-caption"
                    onClick={() => handleEditCaption(photo.id, photo.caption)}
                  >
                    {photo.caption}
                  </p>
                ) : (
                  <button
                    type="button"
                    className="gallery__card-add-caption"
                    onClick={() => handleEditCaption(photo.id, "")}
                  >
                    {t("gallery.addCaption")}
                  </button>
                )}
              </article>
            ))}
        </div>
      )}

      <BottomMenu />
    </div>
  );
}

export default PetGallery;
