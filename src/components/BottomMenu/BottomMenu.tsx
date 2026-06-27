import { FaPaw, FaPlus, FaCog, FaCalendarAlt, FaImages } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "../../i18n/useTranslation";
import "./BottomMenu.css";

const ITEMS = [
  { path: "/", icon: FaPaw, labelKey: "nav.pets" as const },
  { path: "/calendar", icon: FaCalendarAlt, labelKey: "nav.calendar" as const },
  { path: "/gallery", icon: FaImages, labelKey: "nav.gallery" as const },
  { path: "/create-task", icon: FaPlus, labelKey: "nav.addTask" as const },
  { path: "/settings", icon: FaCog, labelKey: "nav.settings" as const },
];

function BottomMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="bottom-menu">
      {ITEMS.map(({ path, icon: Icon, labelKey }) => {
        const isActive =
          path === "/gallery"
            ? location.pathname === path || location.pathname.startsWith("/gallery/")
            : location.pathname === path;
        const label = t(labelKey);
        return (
          <button
            key={path}
            type="button"
            className={`bottom-menu__item ${
              isActive ? "bottom-menu__item--active" : ""
            }`}
            onClick={() => navigate(path)}
            aria-label={label}
          >
            <Icon size={22} />
            <span className="bottom-menu__label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomMenu;
