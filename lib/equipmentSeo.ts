import type { Metadata } from "next";
import { withEquipmentIndexing } from "./indexing";
import type { EquipmentPageData } from "./serverEquipmentData";

const DEFAULT_OG_IMAGE = "/images/banner.svg";

function displayName(data: EquipmentPageData): string {
  if (data.spec?.brand && data.spec?.model) {
    return `${data.spec.brand} ${data.spec.model}`;
  }
  return data.equipmentName;
}

function buildSpecSummary(data: EquipmentPageData): string {
  const spec = data.spec;
  if (!spec) return "";

  const parts: string[] = [];
  const fields: [string, unknown][] = [
    ["연결", spec.connection],
    ["무게", spec.weight],
    ["센서", spec.sensor],
    ["DPI", spec.dpi],
    ["스위치", spec.switchType],
    ["레이아웃", spec.layout],
    ["주사율", spec.refreshRate],
    ["해상도", spec.resolution],
    ["크기", spec.size],
  ];

  for (const [label, value] of fields) {
    if (typeof value === "string" && value.trim()) {
      parts.push(`${label} ${value}`);
    }
  }

  return parts.join(", ");
}

function buildPlayerSummary(data: EquipmentPageData): string {
  if (data.players.length === 0) return "";
  const names = data.players.slice(0, 8).map((p) => p.playerName);
  const suffix =
    data.players.length > names.length
      ? ` 외 ${data.players.length - names.length}명`
      : "";
  return `사용 선수: ${names.join(", ")}${suffix}`;
}

function buildRelatedTerms(data: EquipmentPageData): string {
  const terms = new Set<string>();
  terms.add(`프로게이머 ${data.typeLabel}`);
  terms.add(`${displayName(data)} ${data.typeLabel}`);
  terms.add(`${data.typeLabel} 랭킹`);

  for (const player of data.players.slice(0, 5)) {
    terms.add(`${player.playerName} ${data.typeLabel}`);
    if (player.playerRealName) {
      terms.add(`${player.playerRealName} ${data.typeLabel}`);
    }
  }

  return `관련: ${Array.from(terms).join(", ")}`;
}

function buildGoogleTitle(data: EquipmentPageData): string {
  const name = displayName(data);
  const count =
    data.players.length > 0 ? ` (${data.players.length}명)` : "";
  return `${name} - 프로게이머 ${data.typeLabel}${count} | 템빨`;
}

function buildOgTitle(data: EquipmentPageData): string {
  return `${displayName(data)} ${data.typeLabel} 템`;
}

function buildDescription(data: EquipmentPageData): string {
  const lines: string[] = [
    `${displayName(data)} — 프로게이머 ${data.typeLabel} 사용 현황.`,
  ];

  const specSummary = buildSpecSummary(data);
  if (specSummary) lines.push(specSummary);

  const playerSummary = buildPlayerSummary(data);
  if (playerSummary) lines.push(playerSummary);

  lines.push(buildRelatedTerms(data));
  return lines.join(" ");
}

function buildOgDescription(data: EquipmentPageData): string {
  const parts: string[] = [];
  const specSummary = buildSpecSummary(data);
  if (specSummary) parts.push(specSummary);
  if (data.players.length > 0) {
    parts.push(`${data.players.length}명의 프로게이머가 사용 중`);
  }
  return parts.join(" · ") || `${displayName(data)} 프로게이머 ${data.typeLabel}`;
}

function resolveOgImage(data: EquipmentPageData): string {
  if (data.spec?.image && typeof data.spec.image === "string") {
    return data.spec.image;
  }
  return DEFAULT_OG_IMAGE;
}

export function buildEquipmentPageMetadata(data: EquipmentPageData): Metadata {
  const ogTitle = buildOgTitle(data);
  const description = buildDescription(data);
  const ogDescription = buildOgDescription(data);
  const ogImage = resolveOgImage(data);
  const canonicalPath = `/equipment/${data.typeKey}/${encodeURIComponent(data.equipmentName)}`;

  return withEquipmentIndexing(
    {
      title: {
        absolute: buildGoogleTitle(data),
      },
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: "website",
        images: [
          {
            url: ogImage,
            alt: displayName(data),
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: [ogImage],
      },
    },
    data,
  );
}
