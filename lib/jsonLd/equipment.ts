import { getEquipmentTypeLabel } from "@/lib/equipmentLabels";
import type { EquipmentPageData } from "@/lib/serverEquipmentData";
import { getSiteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd, type BreadcrumbItem } from "./breadcrumb";

function displayName(data: EquipmentPageData): string {
  if (data.spec?.brand && data.spec?.model) {
    return `${data.spec.brand} ${data.spec.model}`;
  }
  return data.equipmentName;
}

export function buildEquipmentProductJsonLd(data: EquipmentPageData) {
  const base = getSiteUrl();
  const name = displayName(data);
  const path = `/equipment/${data.typeKey}/${encodeURIComponent(data.equipmentName)}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url: `${base}${path}`,
    category: data.typeLabel,
    description: `${data.players.length}명의 프로게이머가 사용 중인 ${name}`,
  };

  if (data.spec?.image) {
    jsonLd.image = `${base}${data.spec.image}`;
  }
  if (data.spec?.brand) {
    jsonLd.brand = {
      "@type": "Brand",
      name: data.spec.brand,
    };
  }
  if (data.players.length > 0) {
    jsonLd.additionalProperty = {
      "@type": "PropertyValue",
      name: "프로게이머 사용 수",
      value: String(data.players.length),
    };
  }

  return jsonLd;
}

export function buildEquipmentPageJsonLd(data: EquipmentPageData) {
  const name = displayName(data);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "홈", path: "/" },
    { name: "장비 랭킹", path: "/equipment" },
    {
      name: data.typeLabel,
      path: `/equipment/${data.typeKey}`,
    },
    {
      name,
      path: `/equipment/${data.typeKey}/${encodeURIComponent(data.equipmentName)}`,
    },
  ];

  return [
    buildEquipmentProductJsonLd(data),
    buildBreadcrumbJsonLd(breadcrumbs),
  ];
}

export function buildEquipmentCategoryJsonLd(
  category: string,
  itemCount: number,
) {
  const label = getEquipmentTypeLabel(category);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "홈", path: "/" },
    { name: "장비 랭킹", path: "/equipment" },
    { name: label, path: `/equipment/${category}` },
  ];

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `프로게이머 ${label} 랭킹`,
      description: `프로게이머가 사용하는 ${label} ${itemCount}개`,
      url: `${getSiteUrl()}/equipment/${category}`,
    },
    buildBreadcrumbJsonLd(breadcrumbs),
  ];
}
