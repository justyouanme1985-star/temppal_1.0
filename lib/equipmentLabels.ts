export const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  mouse: "마우스",
  keyboard: "키보드",
  headset: "헤드셋",
  monitor: "모니터",
  mousepad: "마우스패드",
  chair: "의자",
  desk: "책상",
};

export const EQUIPMENT_CATEGORY_KEYS = Object.keys(
  EQUIPMENT_TYPE_LABELS,
) as (keyof typeof EQUIPMENT_TYPE_LABELS)[];

export function getEquipmentTypeLabel(typeKey: string): string {
  return EQUIPMENT_TYPE_LABELS[typeKey] || typeKey;
}

export function isValidEquipmentType(typeKey: string): boolean {
  return typeKey in EQUIPMENT_TYPE_LABELS;
}
