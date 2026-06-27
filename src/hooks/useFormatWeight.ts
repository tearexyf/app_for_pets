import { useSettingsStore } from "../store/settingsStore";
import { formatWeight, weightInputLabel } from "../utils/weight";

export function useFormatWeight() {
  const unit = useSettingsStore((state) => state.settings.weightUnit);

  return {
    unit,
    formatWeight: (value: number | string) => formatWeight(value, unit),
    weightLabel: weightInputLabel(unit),
  };
}
