import type { Metadata } from "next";
import type { EquipmentPageData } from "./serverEquipmentData";
import type { Player } from "./playerMapping";

/** Pages that should never appear in Google results. */
export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};

export function shouldIndexPlayer(player: Player): boolean {
  return player.equipment.length > 0;
}

export function shouldIndexEquipment(data: EquipmentPageData): boolean {
  return data.players.length > 0;
}

export function withPlayerIndexing(
  metadata: Metadata,
  player: Player,
): Metadata {
  if (!shouldIndexPlayer(player)) {
    return { ...metadata, robots: NOINDEX_ROBOTS };
  }
  return metadata;
}

export function withEquipmentIndexing(
  metadata: Metadata,
  data: EquipmentPageData,
): Metadata {
  if (!shouldIndexEquipment(data)) {
    return { ...metadata, robots: NOINDEX_ROBOTS };
  }
  return metadata;
}
