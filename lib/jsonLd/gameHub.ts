import { getEquipmentTypeLabel } from "@/lib/equipmentLabels";
import { getGameHubConfig } from "@/lib/gameHubConfig";
import type { Game, Player } from "@/lib/playerMapping";
import type { EquipmentRankItem } from "@/lib/serverEquipmentData";
import { getSiteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd, type BreadcrumbItem } from "./breadcrumb";

export function buildGameHubItemListJsonLd(game: Game, players: Player[]) {
  const config = getGameHubConfig(game);
  const base = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${config.label} 프로게이머 장비 랭킹`,
    numberOfItems: players.length,
    itemListElement: players.slice(0, 20).map((player, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: player.playerName,
      url: `${base}/player/${player.id}`,
    })),
  };
}

export function buildGameHubPageJsonLd(game: Game, players: Player[]) {
  const config = getGameHubConfig(game);

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "홈", path: "/" },
    { name: config.label, path: config.path },
  ];

  return [
    buildGameHubItemListJsonLd(game, players),
    buildBreadcrumbJsonLd(breadcrumbs),
  ];
}

export function buildGameCategoryJsonLd(
  game: Game,
  category: string,
  items: EquipmentRankItem[],
) {
  const config = getGameHubConfig(game);
  const label = getEquipmentTypeLabel(category);
  const base = getSiteUrl();

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "홈", path: "/" },
    { name: config.label, path: config.path },
    { name: label, path: `/${game}/${category}` },
  ];

  return [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${config.label} 프로게이머 ${label} 랭킹`,
      numberOfItems: items.length,
      itemListElement: items.slice(0, 20).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${item.brand} ${item.model}`,
        url: `${base}/equipment/${item.category}/${encodeURIComponent(item.key)}`,
      })),
    },
    buildBreadcrumbJsonLd(breadcrumbs),
  ];
}

export function buildEquipmentRankingJsonLd(itemCount: number) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "홈", path: "/" },
    { name: "장비 랭킹", path: "/equipment" },
  ];

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "프로게이머 인기 장비 랭킹",
      description: `프로게이머 ${itemCount}개 장비 인기 순위`,
      url: `${getSiteUrl()}/equipment`,
    },
    buildBreadcrumbJsonLd(breadcrumbs),
  ];
}
