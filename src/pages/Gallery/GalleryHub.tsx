import { useNavigate } from "react-router-dom";
import { getPets, getGalleryPhotosForPet } from "../../services/storage";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import { FaPaw, FaImages } from "react-icons/fa";
import { useTranslation } from "../../i18n/useTranslation";
import "./Gallery.css";

function GalleryHub() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pets = getPets();

  return (
    <div className="gallery-page">
      <header className="gallery__header">
        <h1 className="gallery__title">{t("gallery.title")}</h1>
        <p className="gallery__subtitle">{t("gallery.hubSubtitle")}</p>
      </header>

      {pets.length === 0 ? (
        <div className="gallery__hub-empty">
          <p>{t("gallery.noPets")}</p>
          <button
            type="button"
            className="gallery__btn"
            onClick={() => navigate("/create-pet")}
          >
            {t("gallery.addPet")}
          </button>
        </div>
      ) : (
        <div className="gallery__hub-list">
          {pets.map((pet) => {
            const photos = getGalleryPhotosForPet(pet.id);
            const previews = photos
              .slice()
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .slice(0, 3);

            return (
              <button
                key={pet.id}
                type="button"
                className="gallery__hub-card"
                onClick={() => navigate(`/gallery/${pet.id}`)}
              >
                <div className="gallery__hub-card-head">
                  {pet.photo ? (
                    <img
                      className="gallery__hub-avatar"
                      src={pet.photo}
                      alt={pet.name}
                    />
                  ) : (
                    <span className="gallery__hub-avatar-placeholder">
                      <FaPaw />
                    </span>
                  )}
                  <div className="gallery__hub-info">
                    <span className="gallery__hub-name">{pet.name}</span>
                    <span className="gallery__hub-count">
                      {t("gallery.photoCount", { count: photos.length })}
                    </span>
                  </div>
                  <FaImages className="gallery__hub-icon" size={18} />
                </div>

                {previews.length > 0 ? (
                  <div className="gallery__hub-previews">
                    {previews.map((photo) => (
                      <img
                        key={photo.id}
                        className="gallery__hub-preview"
                        src={photo.image}
                        alt={photo.caption || pet.name}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="gallery__hub-no-photos">{t("gallery.noPhotosYet")}</p>
                )}
              </button>
            );
          })}
        </div>
      )}

      <BottomMenu />
    </div>
  );
}

export default GalleryHub;
