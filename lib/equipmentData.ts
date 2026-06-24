// Auto-generated equipment database
// Generated: 2026-04-03

import {
  normalizeEquipmentLabel,
  resolveCanonicalEquipmentKey,
  equipmentLabelsMatch,
} from "./equipment/matchEquipment";

export interface MouseSpec {
  brand: string;
  model: string;
  image: string;
  connection: string;
  height: string;
  width: string;
  length: string;
  weight: string;
  buttons: string;
  sensor: string;
  dpi: string;
  maxAccel: string;
  maxSpeed: string;
  officialUrl: string;
  coupangUrl: string;
}

export interface KeyboardSpec {
  brand: string;
  model: string;
  image: string;
  switchType: string;
  layout: string;
  connection: string;
  features: string;
  officialUrl: string;
  coupangUrl: string;
}

export interface HeadsetSpec {
  brand: string;
  model: string;
  image: string;
  driver: string;
  freqResponse: string;
  impedance: string;
  sensitivity: string;
  officialUrl: string;
  coupangUrl: string;
}

export interface MonitorSpec {
  brand: string;
  model: string;
  image: string;
  refreshRate: string;
  size: string;
  resolution: string;
  panelType: string;
  officialUrl: string;
  coupangUrl: string;
}

export interface MousepadSpec {
  brand: string;
  model: string;
  image: string;
  size: string;
  surface: string;
  thickness: string;
  officialUrl: string;
  coupangUrl: string;
}

export interface ChairSpec {
  brand: string;
  model: string;
  image: string;
  officialUrl: string;
  coupangUrl: string;
}

export interface DeskSpec {
  brand: string;
  model: string;
  image: string;
  officialUrl: string;
  coupangUrl: string;
}

export const mouseDb: Record<string, MouseSpec> = {
  "Logitech G Pro": {
    brand: "Logitech", model: "G Pro Gaming Mouse",
    image: "/images/equipments/Logitech_G-PRO-Wireless.webp",
    connection: "\uc720\uc120", height: "38.2mm", width: "62.15mm", length: "116.6mm", weight: "85g",
    buttons: "6", sensor: "HERO 16K", dpi: "100~16,000 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-hero.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20Gaming%20Mouse&channel=user",
  },
  "Logitech G Pro Gaming Mouse": {
    brand: "Logitech", model: "G Pro Gaming Mouse",
    image: "/images/equipments/Logitech_G-PRO-Wireless.webp",
    connection: "\uc720\uc120", height: "38.2mm", width: "62.15mm", length: "116.6mm", weight: "85g",
    buttons: "6", sensor: "HERO 16K", dpi: "100~16,000 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-hero.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20Gaming%20Mouse&channel=user",
  },
  "Logitech G Pro Wireless": {
    brand: "Logitech", model: "G Pro Wireless",
    image: "/images/equipments/Logitech_G-Pro-Wireless.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "80g",
    buttons: "8", sensor: "HERO 25K", dpi: "100~25,600 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20Wireless&channel=user",
  },
  "Logitech G Pro Superlight": {
    brand: "Logitech", model: "G Pro X Superlight",
    image: "/images/equipments/Logitech_Pro-x-superlight.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "63g",
    buttons: "5", sensor: "HERO 25K", dpi: "100~25,600 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight&channel=user",
  },
  "Logitech G Pro X Superlight": {
    brand: "Logitech", model: "G Pro X Superlight",
    image: "/images/equipments/Logitech_Pro-x-superlight.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "63g",
    buttons: "5", sensor: "HERO 25K", dpi: "100~25,600 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight&channel=user",
  },
  "Logitech G Pro X Superlight Black": {
    brand: "Logitech", model: "G Pro X Superlight",
    image: "/images/equipments/Logitech_Pro-x-superlight.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "63g",
    buttons: "5", sensor: "HERO 25K", dpi: "100~25,600 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight&channel=user",
  },
  "Logitech G Pro X Superlight 2": {
    brand: "Logitech", model: "G Pro X Superlight 2",
    image: "/images/equipments/Logitech_Pro-x-superlight-2.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "60g",
    buttons: "5", sensor: "HERO 2", dpi: "100~44,000 DPI", maxAccel: "88 G", maxSpeed: "888 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x2-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight%202&channel=user",
  },
  "Logitech G Pro X Superlight 2 Dex Black": {
    brand: "Logitech", model: "G Pro X Superlight 2",
    image: "/images/equipments/Logitech_Pro-x-superlight-2.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "60g",
    buttons: "5", sensor: "HERO 2", dpi: "100~44,000 DPI", maxAccel: "88 G", maxSpeed: "888 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x2-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight%202&channel=user",
  },
  "Logitech G Pro X Superlight 2 White": {
    brand: "Logitech", model: "G Pro X Superlight 2",
    image: "/images/equipments/Logitech_Pro-x-superlight-2.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "60g",
    buttons: "5", sensor: "HERO 2", dpi: "100~44,000 DPI", maxAccel: "88 G", maxSpeed: "888 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x2-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight%202&channel=user",
  },
  "Logitech G PRO X Superlight 2": {
    brand: "Logitech", model: "G Pro X Superlight 2",
    image: "/images/equipments/Logitech_Pro-x-superlight-2.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "60g",
    buttons: "5", sensor: "HERO 2", dpi: "100~44,000 DPI", maxAccel: "88 G", maxSpeed: "888 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x2-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight%202&channel=user",
  },
  "\ub85c\uc9c0\ud14d G PRO X \uc288\ud37c\ub77c\uc774\ud2b8 2": {
    brand: "Logitech", model: "G Pro X Superlight 2",
    image: "/images/equipments/Logitech_Pro-x-superlight-2.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "60g",
    buttons: "5", sensor: "HERO 2", dpi: "100~44,000 DPI", maxAccel: "88 G", maxSpeed: "888 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x2-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight%202&channel=user",
  },
  "Logitech G Pro X2 Superlight": {
    brand: "Logitech", model: "G Pro X Superlight 2",
    image: "/images/equipments/Logitech_Pro-x-superlight-2.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "60g",
    buttons: "5", sensor: "HERO 2", dpi: "100~44,000 DPI", maxAccel: "88 G", maxSpeed: "888 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x2-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight%202&channel=user",
  },
  "Logitech G Pro X2 SUPERSTRIKE": {
    brand: "Logitech", model: "G Pro X2 Superstrike",
    image: "/images/equipments/Logitech_G-Pro-X2-Superstrike.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "60g",
    buttons: "5", sensor: "HERO 2", dpi: "100~44,000 DPI", maxAccel: "88 G", maxSpeed: "888 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x2-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X2%20Superstrike&channel=user",
  },
  "\ub85c\uc9c0\ud14d G X SUPERLIGHT2": {
    brand: "Logitech", model: "G Pro X Superlight 2",
    image: "/images/equipments/Logitech_Pro-x-superlight-2.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "60g",
    buttons: "5", sensor: "HERO 2", dpi: "100~44,000 DPI", maxAccel: "88 G", maxSpeed: "888 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x2-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight%202&channel=user",
  },
  "\ub85c\uc9c0\ud14d G X SUPERLIGHT3 / \ub85c\uc9c0\ud14d G PRO X SUPERLIGHT2": {
    brand: "Logitech", model: "G Pro X Superlight 2",
    image: "/images/equipments/Logitech_Pro-x-superlight-2.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "60g",
    buttons: "5", sensor: "HERO 2", dpi: "100~44,000 DPI", maxAccel: "88 G", maxSpeed: "888 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x2-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight%202&channel=user",
  },
  "\ub85c\uc9c0\ud14d G X SUPERLIGHT4": {
    brand: "Logitech", model: "G Pro X Superlight 2",
    image: "/images/equipments/Logitech_Pro-x-superlight-2.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "60g",
    buttons: "5", sensor: "HERO 2", dpi: "100~44,000 DPI", maxAccel: "88 G", maxSpeed: "888 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x2-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight%202&channel=user",
  },
  "Logitech G305": {
    brand: "Logitech", model: "G305",
    image: "/images/equipments/Logitech_G305.webp",
    connection: "\ubb34\uc120", height: "38.2mm", width: "62.15mm", length: "116.8mm", weight: "99g",
    buttons: "6", sensor: "HERO 12K", dpi: "200~12,000 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/g305-lightspeed-wireless-gaming-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G305&channel=user",
  },
  "Logitech G403 HERO": {
    brand: "Logitech", model: "G403 HERO",
    image: "/images/equipments/Logitech_G403-HERO.webp",
    connection: "\uc720\uc120", height: "43mm", width: "68mm", length: "124mm", weight: "87g",
    buttons: "6", sensor: "HERO 25K", dpi: "100~25,600 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/g403-hero-gaming-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G403%20HERO&channel=user",
  },
  "Logitech G502 X": {
    brand: "Logitech", model: "G502 X",
    image: "/images/equipments/Logitech_G502-X.webp",
    connection: "\uc720\uc120", height: "41.1mm", width: "79.2mm", length: "131.4mm", weight: "89g",
    buttons: "13", sensor: "HERO 25K", dpi: "100~25,600 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/g502-x-wired-lightforce.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G502%20X&channel=user",
  },
  "Logitech G703": {
    brand: "Logitech", model: "G703",
    image: "/images/equipments/Logitech_G703.webp",
    connection: "\ubb34\uc120", height: "43mm", width: "68mm", length: "124mm", weight: "95g",
    buttons: "6", sensor: "HERO 25K", dpi: "100~25,600 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/g703-hero-wireless-gaming.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G703&channel=user",
  },
  "Logitech G903": {
    brand: "Logitech", model: "G903",
    image: "/images/equipments/Logitech_G903.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "66mm", length: "130mm", weight: "110g",
    buttons: "11", sensor: "HERO 25K", dpi: "100~25,600 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/g903-hero-wireless-gaming-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G903&channel=user",
  },
  "\ub85c\uc9c0\ud14d G102": {
    brand: "Logitech", model: "G102",
    image: "/images/equipments/Logitech_G102.webp",
    connection: "\uc720\uc120", height: "38.2mm", width: "62.15mm", length: "116.6mm", weight: "85g",
    buttons: "6", sensor: "Mercury", dpi: "200~8,000 DPI", maxAccel: ">25 G", maxSpeed: "200 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/g102-lightsync-rgb-gaming-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G102&channel=user",
  },
  "\ub85c\uc9c0\ud14d \ubbf8\ub2c8\uc635": {
    brand: "Logitech", model: "G Pro X Superlight",
    image: "/images/equipments/Logitech_Pro-x-superlight.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "63.5mm", length: "125mm", weight: "63g",
    buttons: "5", sensor: "HERO 25K", dpi: "100~25,600 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-x-superlight-wireless-mouse.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Superlight&channel=user",
  },
  "\ub85c\uc9c0\ud14d g PRO (\uac80\uc815\uc0c9)": {
    brand: "Logitech", model: "G Pro Gaming Mouse",
    image: "/images/equipments/Logitech_G-Pro.webp",
    connection: "\uc720\uc120", height: "38.2mm", width: "62.15mm", length: "116.6mm", weight: "85g",
    buttons: "6", sensor: "HERO 16K", dpi: "100~16,000 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/pro-hero.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20Gaming%20Mouse&channel=user",
  },
  "Razer DeathAdder V3 Pro Faker Edition": {
    brand: "Razer", model: "DeathAdder V3 Pro",
    image: "/images/equipments/Razer_DeathAdder-V3-Pro.webp",
    connection: "\ubb34\uc120", height: "44mm", width: "67.6mm", length: "128.3mm", weight: "63g",
    buttons: "5", sensor: "Focus Pro 30K", dpi: "100~30,000 DPI", maxAccel: "70 G", maxSpeed: "750 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-deathadder-v3-pro/RZ01-04630100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20DeathAdder%20V3%20Pro&channel=user",
  },
  "Razer Deathadder V2 Pro": {
    brand: "Razer", model: "DeathAdder V2 Pro",
    image: "/images/equipments/Razer_DeathAdder-V2-Pro.webp",
    connection: "\ubb34\uc120", height: "42.7mm", width: "71.6mm", length: "127mm", weight: "88g",
    buttons: "8", sensor: "Focus+ 20K", dpi: "100~20,000 DPI", maxAccel: "50 G", maxSpeed: "650 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-deathadder-v2-pro/RZ01-03350100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20DeathAdder%20V2%20Pro&channel=user",
  },
  "Razer DeathAdder V4 Pro White": {
    brand: "Razer", model: "DeathAdder V3 Pro",
    image: "/images/equipments/Razer_DeathAdder-V3-Pro.webp",
    connection: "\ubb34\uc120", height: "44mm", width: "67.6mm", length: "128.3mm", weight: "63g",
    buttons: "5", sensor: "Focus Pro 30K", dpi: "100~30,000 DPI", maxAccel: "70 G", maxSpeed: "750 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-deathadder-v3-pro/RZ01-04630100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20DeathAdder%20V3%20Pro&channel=user",
  },
  "\ub808\uc774\uc800 \ub370\uc2a4\uc5d0\ub354 V3 \ud504\ub85c": {
    brand: "Razer", model: "DeathAdder V3 Pro",
    image: "/images/equipments/Razer_DeathAdder-V3-Pro.webp",
    connection: "\ubb34\uc120", height: "44mm", width: "67.6mm", length: "128.3mm", weight: "63g",
    buttons: "5", sensor: "Focus Pro 30K", dpi: "100~30,000 DPI", maxAccel: "70 G", maxSpeed: "750 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-deathadder-v3-pro/RZ01-04630100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20DeathAdder%20V3%20Pro&channel=user",
  },
  "Razer Viper 8KHz": {
    brand: "Razer", model: "Viper 8KHz",
    image: "/images/equipments/Razer_Viper-8KHz.webp",
    connection: "\uc720\uc120", height: "37.8mm", width: "66.2mm", length: "126.7mm", weight: "71g",
    buttons: "8", sensor: "Focus+ 20K", dpi: "100~20,000 DPI", maxAccel: "50 G", maxSpeed: "650 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-viper-8khz/RZ01-03580100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Viper%208KHz&channel=user",
  },
  "Razer Viper V3 Pro": {
    brand: "Razer", model: "Viper V3 Pro",
    image: "/images/equipments/Razer_Viper-V3-Pro-White.webp",
    connection: "\ubb34\uc120", height: "37.6mm", width: "63.7mm", length: "127.1mm", weight: "54g",
    buttons: "6", sensor: "Focus Pro 36K", dpi: "100~36,000 DPI", maxAccel: "70 G", maxSpeed: "750 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-viper-v3-pro/RZ01-05110100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Viper%20V3%20Pro&channel=user",
  },
  "Razer Viper V3 Pro Black": {
    brand: "Razer", model: "Viper V3 Pro",
    image: "/images/equipments/Razer_Viper-V3-Pro-White.webp",
    connection: "\ubb34\uc120", height: "37.6mm", width: "63.7mm", length: "127.1mm", weight: "54g",
    buttons: "6", sensor: "Focus Pro 36K", dpi: "100~36,000 DPI", maxAccel: "70 G", maxSpeed: "750 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-viper-v3-pro/RZ01-05110100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Viper%20V3%20Pro&channel=user",
  },
  "Razer Viper V3 Pro White": {
    brand: "Razer", model: "Viper V3 Pro",
    image: "/images/equipments/Razer_Viper-V3-Pro-White.webp",
    connection: "\ubb34\uc120", height: "37.6mm", width: "63.7mm", length: "127.1mm", weight: "54g",
    buttons: "6", sensor: "Focus Pro 36K", dpi: "100~36,000 DPI", maxAccel: "70 G", maxSpeed: "750 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-viper-v3-pro/RZ01-05110100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Viper%20V3%20Pro&channel=user",
  },
  "\ub808\uc774\uc800 \ubc14\uc774\ud37c V3 \ud504\ub85c": {
    brand: "Razer", model: "Viper V3 Pro",
    image: "/images/equipments/Razer_Viper-V3-Pro-White.webp",
    connection: "\ubb34\uc120", height: "37.6mm", width: "63.7mm", length: "127.1mm", weight: "54g",
    buttons: "6", sensor: "Focus Pro 36K", dpi: "100~36,000 DPI", maxAccel: "70 G", maxSpeed: "750 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-viper-v3-pro/RZ01-05110100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Viper%20V3%20Pro&channel=user",
  },
  "\ub808\uc774\uc800 \uc624\ub85c\uce58 V2": {
    brand: "Razer", model: "Orochi V2",
    image: "/images/equipments/Razer_Orochi-V2.webp",
    connection: "\ubb34\uc120", height: "35.7mm", width: "62.6mm", length: "108mm", weight: "60g",
    buttons: "6", sensor: "5G Advanced 18K", dpi: "100~18,000 DPI", maxAccel: "40 G", maxSpeed: "450 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-orochi-v2/RZ01-03730100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Orochi%20V2&channel=user",
  },
  "CORSAIR M75 AIR": {
    brand: "Corsair", model: "M75 AIR",
    image: "/images/equipments/Corsair_M75-AIR.webp",
    connection: "\ubb34\uc120", height: "39.5mm", width: "64.2mm", length: "123.3mm", weight: "60g",
    buttons: "6", sensor: "CORSAIR MARKSMAN", dpi: "100~26,000 DPI", maxAccel: "50 G", maxSpeed: "650 IPS",
    officialUrl: "https://www.corsair.com/kr/ko/p/mouse/ch-931a1aa-ap/m75-air-wireless-ultra-lightweight-gaming-mouse-black-ch-931a1aa-ap/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20M75%20AIR&channel=user",
  },
  "Corsair Sabre V2 Pro CF": {
    brand: "Corsair", model: "Sabre RGB Pro Champion",
    image: "/images/equipments/Corsair_Sabre-RGB-Pro.webp",
    connection: "\uc720\uc120", height: "43mm", width: "70mm", length: "129mm", weight: "74g",
    buttons: "6", sensor: "CORSAIR MARKSMAN", dpi: "100~18,000 DPI", maxAccel: "50 G", maxSpeed: "650 IPS",
    officialUrl: "https://www.corsair.com/kr/ko/p/mouse/ch-9303111-ap/sabre-rgb-pro-champion-series-fps-moba-gaming-mouse-ch-9303111-ap/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20Sabre%20RGB%20Pro%20Champion&channel=user",
  },
  "ROCCAT Kone Pure Ultra": {
    brand: "ROCCAT", model: "Kone Pure Ultra",
    image: "/images/equipments/ROCCAT_Kone-Pure-Ultra.webp",
    connection: "\uc720\uc120", height: "39mm", width: "70mm", length: "115mm", weight: "66g",
    buttons: "7", sensor: "Owl-Eye 16K", dpi: "50~16,000 DPI", maxAccel: "50 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.roccat.com/products/kone-pure-ultra",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=ROCCAT%20Kone%20Pure%20Ultra&channel=user",
  },
  "\uc870\uc704 EC2-CW": {
    brand: "Zowie", model: "EC2-CW",
    image: "/images/equipments/Zowie_EC2-CW.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "64mm", length: "120mm", weight: "77g",
    buttons: "5", sensor: "3370", dpi: "400~3,200 DPI", maxAccel: "", maxSpeed: "",
    officialUrl: "https://zowie.benq.com/ko-kr/mouse/ec2-cw.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Zowie%20EC2-CW&channel=user",
  },
  "\uc870\uc704\uae30\uc5b4 \ubbf8\ucf54": {
    brand: "Zowie", model: "Mico",
    image: "/images/equipments/Zowie_Mico.webp",
    connection: "\uc720\uc120", height: "", width: "", length: "", weight: "",
    buttons: "", sensor: "", dpi: "", maxAccel: "", maxSpeed: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Zowie%20Mico&channel=user",
  },
  "\uc870\uc704\uae30\uc5b4 \ubbf8\ucf54 \ub9c8\uc6b0\uc2a4 kt": {
    brand: "Zowie", model: "Mico",
    image: "/images/equipments/Zowie_Mico.webp",
    connection: "\uc720\uc120", height: "", width: "", length: "", weight: "",
    buttons: "", sensor: "", dpi: "", maxAccel: "", maxSpeed: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Zowie%20Mico&channel=user",
  },
  "FKMINI 2": {
    brand: "Cama", model: "FK MINI 2",
    image: "/images/equipments/Cama_FK-MINI-2.webp",
    connection: "\uc720\uc120", height: "", width: "", length: "", weight: "",
    buttons: "", sensor: "", dpi: "", maxAccel: "", maxSpeed: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Cama%20FK%20MINI%202&channel=user",
  },
  "\uce74\ub9c8 FK MINI3": {
    brand: "Cama", model: "FK MINI 3",
    image: "/images/equipments/Cama_FK-MINI-3.webp",
    connection: "\uc720\uc120", height: "", width: "", length: "", weight: "",
    buttons: "", sensor: "", dpi: "", maxAccel: "", maxSpeed: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Cama%20FK%20MINI%203&channel=user",
  },
  "\uce74\ub9c8 FK MINI3 / FKMINI \ub7ed\ube44\uacf5 \ub9c8\uc6b0\uc2a4": {
    brand: "Cama", model: "FK MINI 3",
    image: "/images/equipments/Cama_FK-MINI-3.webp",
    connection: "\uc720\uc120", height: "", width: "", length: "", weight: "",
    buttons: "", sensor: "", dpi: "", maxAccel: "", maxSpeed: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Cama%20FK%20MINI%203&channel=user",
  },
  "G303 \ub85c\uc9c0\ud14d \ucd95\uad6c\uacf5(\ucee4\uc2a4\ud140) \ub9c8\uc6b0\uc2a4": {
    brand: "Logitech", model: "G303 Shroud Edition",
    image: "/images/equipments/Logitech_G303.webp",
    connection: "\ubb34\uc120", height: "40mm", width: "67mm", length: "117mm", weight: "75g",
    buttons: "6", sensor: "HERO 25K", dpi: "100~25,600 DPI", maxAccel: ">40 G", maxSpeed: "400 IPS",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mice/g303-shroud-edition-702.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G303%20Shroud%20Edition&channel=user",
  },
  "LAMZU \uc544\ud2c0\ub780\ud2f0\uc2a4 \uac8c\uc774\ubc0d \ub9c8\uc6b0\uc2a4": {
    brand: "Lamzu", model: "Atlantis",
    image: "/images/equipments/Lamzu_Atlantis.webp",
    connection: "\ubb34\uc120", height: "38.5mm", width: "64mm", length: "122mm", weight: "55g",
    buttons: "6", sensor: "PAW3950", dpi: "50~30,000 DPI", maxAccel: "50 G", maxSpeed: "750 IPS",
    officialUrl: "https://lamzu.com/products/atlantis",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Lamzu%20Atlantis&channel=user",
  },
  "\uc790\uc624\ud540 Z1 pro": {
    brand: "Zhaopin", model: "Z1 Pro",
    image: "/images/equipments/Zhaopin_Z1-Pro.webp",
    connection: "\uc720\uc120", height: "", width: "", length: "", weight: "",
    buttons: "", sensor: "", dpi: "", maxAccel: "", maxSpeed: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Zhaopin%20Z1%20Pro&channel=user",
  },
  "\ubc14\uc774\ud37c \ubbf8\ub2c8 \ubb34\uc120 \uc2dc\uadf8\ub2c8\ucc98 \ub9c8\uc6b0\uc2a4": {
    brand: "Razer", model: "Viper Mini Signature Edition",
    image: "/images/equipments/Razer_Viper-Mini-Signature.webp",
    connection: "\ubb34\uc120", height: "37mm", width: "61.5mm", length: "118mm", weight: "49g",
    buttons: "5", sensor: "Focus Pro 30K", dpi: "100~30,000 DPI", maxAccel: "70 G", maxSpeed: "750 IPS",
    officialUrl: "https://www.razer.com/gaming-mice/razer-viper-mini-signature-edition/RZ01-04410100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Viper%20Mini%20Signature%20Edition&channel=user",
  },
  "\uc5d1\uc2a4\ud2b8\ub9ac\ud30c\uc774": {
    brand: "X-trfy", model: "M8 Wireless",
    image: "/images/equipments/Xtrfy_M8-Wireless.webp",
    connection: "\ubb34\uc120", height: "", width: "", length: "", weight: "",
    buttons: "", sensor: "", dpi: "", maxAccel: "", maxSpeed: "",
    officialUrl: "https://xtrfy.com",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=X-trfy%20M8%20Wireless&channel=user",
  },
};

export const keyboardDb: Record<string, KeyboardSpec> = {
  "Logitech G Pro X Keyboard": {
    brand: "Logitech", model: "G Pro X Keyboard",
    image: "/images/equipments/102001_G_PRO_X_Mechanical_Keyboard.webp",
    switchType: "GX \uc2a4\uc704\uce58", layout: "TKL", connection: "\uc720\uc120", features: "RGB, \ud56b\uc2a4\uc651",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/pro-x-keyboard-clicky.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Keyboard&channel=user",
  },
  "Logitech G Pro X TKL Keyboard Black": {
    brand: "Logitech", model: "G Pro X TKL",
    image: "/images/equipments/Logitech_G-Pro-X-TKL.webp",
    switchType: "GX \uc2a4\uc704\uce58", layout: "TKL", connection: "\ubb34\uc120", features: "RGB, LIGHTSPEED",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/pro-x-tkl-wireless-keyboard.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20TKL&channel=user",
  },
  "Logitech G PRO X TKL": {
    brand: "Logitech", model: "G Pro X TKL",
    image: "/images/equipments/Logitech_G-Pro-X-TKL.webp",
    switchType: "GX \uc2a4\uc704\uce58", layout: "TKL", connection: "\ubb34\uc120", features: "RGB, LIGHTSPEED",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/pro-x-tkl-wireless-keyboard.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20TKL&channel=user",
  },
  "\ub85c\uc9c0\ud14d G PRO X TKL": {
    brand: "Logitech", model: "G Pro X TKL",
    image: "/images/equipments/Logitech_G-Pro-X-TKL.webp",
    switchType: "GX \uc2a4\uc704\uce58", layout: "TKL", connection: "\ubb34\uc120", features: "RGB, LIGHTSPEED",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/pro-x-tkl-wireless-keyboard.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20TKL&channel=user",
  },
  "Logitech G PRO X Mechanical Keyboard": {
    brand: "Logitech", model: "G PRO X Mechanical Keyboard",
    image: "/images/equipments/102001_G_PRO_X_Mechanical_Keyboard.webp",
    switchType: "GX \uc2a4\uc704\uce58", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "RGB, \ud56b\uc2a4\uc651",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/pro-x-mechanical-gaming-keyboard.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20PRO%20X%20Mechanical%20Keyboard&channel=user",
  },
  "\ub85c\uc9c0\ud14d G PRO X \uae30\uacc4\uc2dd \ud074\ubcf4\ub4dc": {
    brand: "Logitech", model: "G PRO X Mechanical Keyboard",
    image: "/images/equipments/102001_G_PRO_X_Mechanical_Keyboard.webp",
    switchType: "GX \uc2a4\uc704\uce58", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "RGB, \ud56b\uc2a4\uc651",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/pro-x-mechanical-gaming-keyboard.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20PRO%20X%20Mechanical%20Keyboard&channel=user",
  },
  "Logitech G512": {
    brand: "Logitech", model: "G512",
    image: "/images/equipments/Logitech_G512.webp",
    switchType: "GX \uc2a4\uc704\uce58", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "RGB, \uc54c\ub8e8\ubbf8\ub284",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/g512-mechanical-gaming-keyboard.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G512&channel=user",
  },
  "Logitech G513": {
    brand: "Logitech", model: "G513",
    image: "/images/equipments/Logitech_G513.webp",
    switchType: "GX \uc2a4\uc704\uce58", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "RGB, \ud31c\ub808\uc2a4\ud2b8",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/g513-backlit-mechanical-gaming-keyboard.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G513&channel=user",
  },
  "Logitech G610": {
    brand: "Logitech", model: "G610 Orion",
    image: "/images/equipments/Logitech_G610.webp",
    switchType: "Cherry MX", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "\ubc31\ub77c\uc774\ud2b8",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/g610-orion-brown-backlit-keyboard.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G610%20Orion&channel=user",
  },
  "Logitech G715": {
    brand: "Logitech", model: "G715",
    image: "/images/equipments/Logitech_G715.webp",
    switchType: "GX \uc2a4\uc704\uce58", layout: "TKL", connection: "\ubb34\uc120", features: "RGB, LIGHTSPEED, \ud31c\ub808\uc2a4\ud2b8",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/g715-wireless-gaming-keyboard.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G715&channel=user",
  },
  "Logitech G913 TKL": {
    brand: "Logitech", model: "G913 TKL",
    image: "/images/equipments/Logitech_G913-TKL.webp",
    switchType: "GL \ub85c\ud504\ub85c\ud30c\uc77c", layout: "TKL", connection: "\ubb34\uc120", features: "RGB, LIGHTSPEED, \ub85c\ud504\ub85c\ud30c\uc77c",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/g913-tkl-wireless.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G913%20TKL&channel=user",
  },
  "Logitech G915": {
    brand: "Logitech", model: "G915",
    image: "/images/equipments/Logitech_G915.webp",
    switchType: "GL \ub85c\ud504\ub85c\ud30c\uc77c", layout: "\ud480\uc0ac\uc774\uc988", connection: "\ubb34\uc120", features: "RGB, LIGHTSPEED, \ub85c\ud504\ub85c\ud30c\uc77c",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/g915-low-profile-wireless-mechanical-gaming-keyboard.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G915&channel=user",
  },
  "Logitech G915 TKL Carbon": {
    brand: "Logitech", model: "G915 TKL",
    image: "/images/equipments/Logitech_G915-TKL.webp",
    switchType: "GL \ub85c\ud504\ub85c\ud30c\uc77c", layout: "TKL", connection: "\ubb34\uc120", features: "RGB, LIGHTSPEED, \ub85c\ud504\ub85c\ud30c\uc77c",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-keyboards/g915-tkl-wireless.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G915%20TKL&channel=user",
  },
  "Razer Huntsman V3 Pro": {
    brand: "Razer", model: "Huntsman V3 Pro",
    image: "/images/equipments/Razer_Huntsman-V3-Pro.webp",
    switchType: "Razer Analog Optical", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "RGB, \ud56b\uc2a4\uc651, \uc870\uc808\uc2dd \uc561\ucd94\uc5d0\uc774\uc158",
    officialUrl: "https://www.razer.com/gaming-keyboards/razer-huntsman-v3-pro/RZ03-04970100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Huntsman%20V3%20Pro&channel=user",
  },
  "\ub808\uc774\uc800 \ud5cc\uce20\ub9e8 V3 \ud504\ub85c": {
    brand: "Razer", model: "Huntsman V3 Pro",
    image: "/images/equipments/Razer_Huntsman-V3-Pro.webp",
    switchType: "Razer Analog Optical", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "RGB, \ud56b\uc2a4\uc651, \uc870\uc808\uc2dd \uc561\ucd94\uc5d0\uc774\uc158",
    officialUrl: "https://www.razer.com/gaming-keyboards/razer-huntsman-v3-pro/RZ03-04970100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Huntsman%20V3%20Pro&channel=user",
  },
  "Razer Huntsman V3 Pro TKL": {
    brand: "Razer", model: "Huntsman V3 Pro TKL",
    image: "/images/equipments/Razer_Huntsman-V3-Pro-TKL.webp",
    switchType: "Razer Analog Optical", layout: "TKL", connection: "\uc720\uc120", features: "RGB, \ud56b\uc2a4\uc651, \uc870\uc808\uc2dd \uc561\ucd94\uc5d0\uc774\uc158",
    officialUrl: "https://www.razer.com/gaming-keyboards/razer-huntsman-v3-pro-tenkeyless/RZ03-04980100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Huntsman%20V3%20Pro%20TKL&channel=user",
  },
  "\ub808\uc774\uc800 \ud5cc\uce20\ub9e8 V3 \ud504\ub85c TKL": {
    brand: "Razer", model: "Huntsman V3 Pro TKL",
    image: "/images/equipments/Razer_Huntsman-V3-Pro-TKL.webp",
    switchType: "Razer Analog Optical", layout: "TKL", connection: "\uc720\uc120", features: "RGB, \ud56b\uc2a4\uc651, \uc870\uc808\uc2dd \uc561\ucd94\uc5d0\uc774\uc158",
    officialUrl: "https://www.razer.com/gaming-keyboards/razer-huntsman-v3-pro-tenkeyless/RZ03-04980100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Huntsman%20V3%20Pro%20TKL&channel=user",
  },
  "Razer Huntsman V3 Pro TKL 8KHz Green": {
    brand: "Razer", model: "Huntsman V3 Pro TKL",
    image: "/images/equipments/Razer_Huntsman-V3-Pro-TKL.webp",
    switchType: "Razer Analog Optical", layout: "TKL", connection: "\uc720\uc120", features: "RGB, \ud56b\uc2a4\uc651, 8KHz \ud3f4\ub9c1\ub808\uc774\ud2b8",
    officialUrl: "https://www.razer.com/gaming-keyboards/razer-huntsman-v3-pro-tenkeyless/RZ03-04980100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Huntsman%20V3%20Pro%20TKL&channel=user",
  },
  "Razer Huntsman Elite": {
    brand: "Razer", model: "Huntsman Elite",
    image: "/images/equipments/Razer_Huntsman-Elite.webp",
    switchType: "Razer Optical", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "RGB, \ubbf8\ub514\uc5b4\ud0a4, \ud31c\ub808\uc2a4\ud2b8",
    officialUrl: "https://www.razer.com/gaming-keyboards/razer-huntsman-elite/RZ03-01870100-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Huntsman%20Elite&channel=user",
  },
  "Razer BlackWidow V3 Pro": {
    brand: "Razer", model: "BlackWidow V3 Pro",
    image: "/images/equipments/Razer_BlackWidow-V3-Pro.webp",
    switchType: "Razer Green/Yellow", layout: "\ud480\uc0ac\uc774\uc988", connection: "\ubb34\uc120", features: "RGB, HyperSpeed \ubb34\uc120",
    officialUrl: "https://www.razer.com/gaming-keyboards/razer-blackwidow-v3-pro/RZ03-03530200-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20BlackWidow%20V3%20Pro&channel=user",
  },
  "Razer Blackwidow Lite": {
    brand: "Razer", model: "BlackWidow Lite",
    image: "/images/equipments/Razer_BlackWidow-Lite.webp",
    switchType: "Razer Orange", layout: "TKL", connection: "\uc720\uc120", features: "\ubc31\ub77c\uc774\ud2b8",
    officialUrl: "https://www.razer.com/gaming-keyboards/razer-blackwidow-lite/RZ03-02640200-R3U1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20BlackWidow%20Lite&channel=user",
  },
  "CORSAIR K70": {
    brand: "Corsair", model: "K70 RGB",
    image: "/images/equipments/Corsair_K70.webp",
    switchType: "Cherry MX", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "RGB, \uc54c\ub8e8\ubbf8\ub284",
    officialUrl: "https://www.corsair.com/kr/ko/p/keyboards/ch-9109010-kr/k70-rgb-mk-2-mechanical-gaming-keyboard-cherry-mx-red-ch-9109010-kr/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20K70%20RGB&channel=user",
  },
  "CORSAIR K70 RGB MK.2 SE": {
    brand: "Corsair", model: "K70 RGB MK.2 SE",
    image: "/images/equipments/Corsair_K70-RGB-MK2-SE.webp",
    switchType: "Cherry MX Speed", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "RGB, \uc54c\ub8e8\ubbf8\ub284, PBT \ud0a4\ucea1",
    officialUrl: "https://www.corsair.com/kr/ko/p/keyboards/ch-9109114-kr/k70-rgb-mk-2-se-mechanical-gaming-keyboard-cherry-mx-speed-ch-9109114-kr/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20K70%20RGB%20MK.2%20SE&channel=user",
  },
  "Corsair K70 RGB MK.2": {
    brand: "Corsair", model: "K70 RGB MK.2",
    image: "/images/equipments/Corsair_K70-RGB-MK2.webp",
    switchType: "Cherry MX", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "RGB, \uc54c\ub8e8\ubbf8\ub284",
    officialUrl: "https://www.corsair.com/kr/ko/p/keyboards/ch-9109010-kr/k70-rgb-mk-2-mechanical-gaming-keyboard-cherry-mx-red-ch-9109010-kr/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20K70%20RGB%20MK.2&channel=user",
  },
  "Corsair K70 RGB TKL": {
    brand: "Corsair", model: "K70 RGB TKL",
    image: "/images/equipments/Corsair_K70-RGB-TKL.webp",
    switchType: "Cherry MX", layout: "TKL", connection: "\uc720\uc120", features: "RGB, PBT \ud0a4\ucea1, \ubd84\ub9ac\ud615 \ucf00\uc774\ube14",
    officialUrl: "https://www.corsair.com/kr/ko/p/keyboards/ch-9119010-kr/k70-rgb-tkl-mechanical-gaming-keyboard-cherry-mx-red-ch-9119010-kr/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20K70%20RGB%20TKL&channel=user",
  },
  "Corsair Vanguard Pro 96": {
    brand: "Corsair", model: "K70 PRO",
    image: "/images/equipments/Corsair_K70-PRO.webp",
    switchType: "Cherry MX", layout: "96%", connection: "\uc720\uc120", features: "RGB",
    officialUrl: "https://www.corsair.com/kr/ko/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20K70%20PRO&channel=user",
  },
  "SteelSeries Apex Pro TKL": {
    brand: "SteelSeries", model: "Apex Pro TKL",
    image: "/images/equipments/SteelSeries_Apex-Pro-TKL.webp",
    switchType: "OmniPoint \uc870\uc808\uc2dd", layout: "TKL", connection: "\uc720\uc120", features: "RGB, OLED, \uc870\uc808\uc2dd \uc561\ucd94\uc5d0\uc774\uc158",
    officialUrl: "https://steelseries.com/gaming-keyboards/apex-pro-tkl",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=SteelSeries%20Apex%20Pro%20TKL&channel=user",
  },
  "SteelSeries Apex Pro TKL (2023)": {
    brand: "SteelSeries", model: "Apex Pro TKL (2023)",
    image: "/images/equipments/SteelSeries_Apex-Pro-TKL-2023.webp",
    switchType: "OmniPoint 2.0", layout: "TKL", connection: "\uc720\uc120", features: "RGB, OLED, Rapid Trigger",
    officialUrl: "https://steelseries.com/gaming-keyboards/apex-pro-tkl-2023",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=SteelSeries%20Apex%20Pro%20TKL%20%282023%29&channel=user",
  },
  "ROCCAT Vulcan TKL Pro": {
    brand: "ROCCAT", model: "Vulcan TKL Pro",
    image: "/images/equipments/ROCCAT_Vulcan-TKL-Pro.webp",
    switchType: "Titan Optical", layout: "TKL", connection: "\ubb34\uc120", features: "RGB, \ub85c\ud504\ub85c\ud30c\uc77c",
    officialUrl: "https://www.roccat.com/products/vulcan-tkl-pro",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=ROCCAT%20Vulcan%20TKL%20Pro&channel=user",
  },
  "\ud050\uc13c DT-35": {
    brand: "Qsenn", model: "DT-35",
    image: "/images/equipments/Qsenn_DT-35.webp",
    switchType: "\uba64\ube0c\ub808\uc778", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "\uac8c\uc774\ubc0d \uba64\ube0c\ub808\uc778",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Qsenn%20DT-35&channel=user",
  },
  "\ub808\uc624\ud3f4\ub4dc FC750": {
    brand: "Leopold", model: "FC750R",
    image: "/images/equipments/Leopold_FC750R.webp",
    switchType: "Cherry MX", layout: "TKL", connection: "\uc720\uc120", features: "PBT \ud0a4\ucea1",
    officialUrl: "https://leopold.co.kr",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Leopold%20FC750R&channel=user",
  },
  "\ub808\uc624\ud3f4\ub4dc \uc801\ucd95": {
    brand: "Leopold", model: "FC750R \uc801\ucd95",
    image: "/images/equipments/Leopold_FC750R.webp",
    switchType: "Cherry MX Red", layout: "TKL", connection: "\uc720\uc120", features: "PBT \ud0a4\ucea1",
    officialUrl: "https://leopold.co.kr",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Leopold%20FC750R%20%EC%A0%81%EC%B6%95&channel=user",
  },
  "\ud544\ucf54 \ub9c8\uc81c\uc2a4\ud130\uce582 \ud150\ud0a4\ub9ac\uc2a4 \uac08\ucd95": {
    brand: "Filco", model: "Majestouch 2 TKL",
    image: "/images/equipments/Filco_Majestouch-2-TKL.webp",
    switchType: "Cherry MX Brown", layout: "TKL", connection: "\uc720\uc120", features: "",
    officialUrl: "https://www.diatec.co.jp/en/det.php?prod_c=763",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Filco%20Majestouch%202%20TKL&channel=user",
  },
  "\ub9c8\uc81c\uc2a4\ud130\uce58 \ud544\ucf542 \ud751\ucd95 (\ub178\ub780\uc0c9)": {
    brand: "Filco", model: "Majestouch 2",
    image: "/images/equipments/Filco_Majestouch-2.webp",
    switchType: "Cherry MX Black", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "",
    officialUrl: "https://www.diatec.co.jp/en/det.php?prod_c=763",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Filco%20Majestouch%202&channel=user",
  },
  "\ub371 \ud504\ub791\uc298 \ud55c\uc0b0 \uc801\ucd95": {
    brand: "Deck", model: "Francium",
    image: "/images/equipments/Deck_Francium.webp",
    switchType: "Cherry MX Red", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Deck%20Francium&channel=user",
  },
  "\uc571\ucf54 \ubb34\uc811\uc810": {
    brand: "Abko", model: "\ubb34\uc811\uc810 \ud0a4\ubcf4\ub4dc",
    image: "/images/equipments/Abko_Capacitive.webp",
    switchType: "\uc815\uc804 \uc6a9\ub7c9", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "\ubb34\uc811\uc810",
    officialUrl: "https://abko.co.kr",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Abko%20%EB%AC%B4%EC%A0%91%EC%A0%90%20%ED%82%A4%EB%B3%B4%EB%93%9C&channel=user",
  },
  "\uc81c\ub2c9\uc2a4 \uc2a4\ud1b0\uc5d1\uc2a4 \ud0c0\uc774\ud0c4": {
    brand: "Xenics", model: "StormX Titan",
    image: "/images/equipments/Xenics_StormX-Titan.webp",
    switchType: "\uae30\uacc4\uc2dd", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "",
    officialUrl: "https://xenics.co.kr",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Xenics%20StormX%20Titan&channel=user",
  },
  "\uc81c\ub2c9\uc2a4 \uc2a4\ud1b0\uccb4\uc774\uc11c": {
    brand: "Xenics", model: "StormChaser",
    image: "/images/equipments/Xenics_StormChaser.webp",
    switchType: "\uae30\uacc4\uc2dd", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "",
    officialUrl: "https://xenics.co.kr",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Xenics%20StormChaser&channel=user",
  },
  "\ucee4\uc2a4\ud140 \ud0a4\ubcf4\ub4dc": {
    brand: "", model: "\ucee4\uc2a4\ud140 \ud0a4\ubcf4\ub4dc",
    image: "",
    switchType: "", layout: "", connection: "", features: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=%20%EC%BB%A4%EC%8A%A4%ED%85%80%20%ED%82%A4%EB%B3%B4%EB%93%9C&channel=user",
  },
  "\ud0c0\uc774\ud3f0 \ub9c8\ub974\uc2a4\ud504\ub85c": {
    brand: "Typhoon", model: "Mars Pro",
    image: "/images/equipments/Typhoon_Mars-Pro.webp",
    switchType: "\uae30\uacc4\uc2dd", layout: "\ud480\uc0ac\uc774\uc988", connection: "\uc720\uc120", features: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Typhoon%20Mars%20Pro&channel=user",
  },
};

export const headsetDb: Record<string, HeadsetSpec> = {
  "Logitech G PRO X 2": {
    brand: "Logitech", model: "G Pro X 2 Lightspeed",
    image: "/images/equipments/Logitech_G-Pro-X-2.webp",
    driver: "PRO-G 50mm Graphene", freqResponse: "20 Hz - 20 kHz", impedance: "38 Ohms", sensitivity: "87.5 dB SPL/mW",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-audio/pro-x-2-wireless-headset.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%202%20Lightspeed&channel=user",
  },
  "\ub85c\uc9c0\ud14d G PRO X 2": {
    brand: "Logitech", model: "G Pro X 2 Lightspeed",
    image: "/images/equipments/Logitech_G-Pro-X-2.webp",
    driver: "PRO-G 50mm Graphene", freqResponse: "20 Hz - 20 kHz", impedance: "38 Ohms", sensitivity: "87.5 dB SPL/mW",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-audio/pro-x-2-wireless-headset.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%202%20Lightspeed&channel=user",
  },
  "Logitech G PRO X2": {
    brand: "Logitech", model: "G Pro X 2 Lightspeed",
    image: "/images/equipments/Logitech_G-Pro-X-2.webp",
    driver: "PRO-G 50mm Graphene", freqResponse: "20 Hz - 20 kHz", impedance: "38 Ohms", sensitivity: "87.5 dB SPL/mW",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-audio/pro-x-2-wireless-headset.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%202%20Lightspeed&channel=user",
  },
  "Logitech G PRO X 2 Headset Black": {
    brand: "Logitech", model: "G Pro X 2 Lightspeed",
    image: "/images/equipments/Logitech_G-Pro-X-2.webp",
    driver: "PRO-G 50mm Graphene", freqResponse: "20 Hz - 20 kHz", impedance: "38 Ohms", sensitivity: "87.5 dB SPL/mW",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-audio/pro-x-2-wireless-headset.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%202%20Lightspeed&channel=user",
  },
  "Logitech G Pro X Headset": {
    brand: "Logitech", model: "G Pro X",
    image: "/images/equipments/Logitech_G-Pro-X-Headset.webp",
    driver: "PRO-G 50mm", freqResponse: "20 Hz - 20 kHz", impedance: "35 Ohms", sensitivity: "91.7 dB SPL/mW",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-audio/pro-x-gaming-headset-blue-voice-mic-tech.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X&channel=user",
  },
  "Logitech G Pro X Wireless Headset": {
    brand: "Logitech", model: "G Pro X Wireless Lightspeed",
    image: "/images/equipments/Logitech_G-Pro-X-Wireless-Headset.webp",
    driver: "PRO-G 50mm", freqResponse: "20 Hz - 20 kHz", impedance: "32 Ohms", sensitivity: "87.5 dB SPL/mW",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-audio/pro-x-wireless-headset.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Wireless%20Lightspeed&channel=user",
  },
  "Logitech G Pro Wireless": {
    brand: "Logitech", model: "G Pro X Wireless Lightspeed",
    image: "/images/equipments/Logitech_G-Pro-X-Wireless-Headset.webp",
    driver: "PRO-G 50mm", freqResponse: "20 Hz - 20 kHz", impedance: "32 Ohms", sensitivity: "87.5 dB SPL/mW",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-audio/pro-x-wireless-headset.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%20Wireless%20Lightspeed&channel=user",
  },
  "Logitech G733 Black": {
    brand: "Logitech", model: "G733",
    image: "/images/equipments/Logitech_G733.webp",
    driver: "PRO-G 40mm", freqResponse: "20 Hz - 20 kHz", impedance: "39 Ohms", sensitivity: "87.5 dB SPL/mW",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-audio/g733-rgb-wireless-headset.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G733&channel=user",
  },
  "Razer BlackShark V2": {
    brand: "Razer", model: "BlackShark V2",
    image: "/images/equipments/Razer_BlackShark-V2.webp",
    driver: "TriForce Titanium 50mm", freqResponse: "12 Hz - 28 kHz", impedance: "32 Ohms", sensitivity: "100 dB",
    officialUrl: "https://www.razer.com/gaming-headsets/razer-blackshark-v2",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20BlackShark%20V2&channel=user",
  },
  "\ub808\uc774\uc800 \ube14\ub799\uc0e4\ud06c V2": {
    brand: "Razer", model: "BlackShark V2",
    image: "/images/equipments/Razer_BlackShark-V2.webp",
    driver: "TriForce Titanium 50mm", freqResponse: "12 Hz - 28 kHz", impedance: "32 Ohms", sensitivity: "100 dB",
    officialUrl: "https://www.razer.com/gaming-headsets/razer-blackshark-v2",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20BlackShark%20V2&channel=user",
  },
  "Razer BlackShark V2 Pro Black": {
    brand: "Razer", model: "BlackShark V2 Pro",
    image: "/images/equipments/Razer_BlackShark-V2-Pro.webp",
    driver: "TriForce Titanium 50mm", freqResponse: "12 Hz - 28 kHz", impedance: "32 Ohms", sensitivity: "100 dB",
    officialUrl: "https://www.razer.com/gaming-headsets/razer-blackshark-v2-pro",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20BlackShark%20V2%20Pro&channel=user",
  },
  "Razer BlackShark V3 Pro Black": {
    brand: "Razer", model: "BlackShark V3 Pro",
    image: "/images/equipments/Razer_BlackShark-V3-Pro.webp",
    driver: "TriForce Bio-cellulose 50mm", freqResponse: "12 Hz - 28 kHz", impedance: "32 Ohms", sensitivity: "100 dB",
    officialUrl: "https://www.razer.com/gaming-headsets/razer-blackshark-v3-pro",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20BlackShark%20V3%20Pro&channel=user",
  },
  "Razer BlackShark V3 Pro White": {
    brand: "Razer", model: "BlackShark V3 Pro",
    image: "/images/equipments/Razer_BlackShark-V3-Pro.webp",
    driver: "TriForce Bio-cellulose 50mm", freqResponse: "12 Hz - 28 kHz", impedance: "32 Ohms", sensitivity: "100 dB",
    officialUrl: "https://www.razer.com/gaming-headsets/razer-blackshark-v3-pro",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20BlackShark%20V3%20Pro&channel=user",
  },
  "Razer Kraken V3 Pro": {
    brand: "Razer", model: "Kraken V3 Pro",
    image: "/images/equipments/Razer_Kraken-V3-Pro.webp",
    driver: "TriForce Titanium 50mm", freqResponse: "20 Hz - 20 kHz", impedance: "32 Ohms", sensitivity: "96 dB",
    officialUrl: "https://www.razer.com/gaming-headsets/razer-kraken-v3-pro",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Kraken%20V3%20Pro&channel=user",
  },
  "HyperX Cloud Flight S": {
    brand: "HyperX", model: "Cloud Flight S",
    image: "/images/equipments/HyperX_Cloud-Flight-S.webp",
    driver: "50mm \ub124\uc624\ub514\ubbb4", freqResponse: "10 Hz - 22 kHz", impedance: "32 Ohms", sensitivity: "99.7 dB",
    officialUrl: "https://www.hyperxgaming.com/kr/headsets/cloud-flight-s-wireless-gaming-headset",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=HyperX%20Cloud%20Flight%20S&channel=user",
  },
  "\ud558\uc774\ud37c\uc5d1\uc2a4 \ud074\ub77c\uc6b0\ub4dc II": {
    brand: "HyperX", model: "Cloud II",
    image: "/images/equipments/HyperX_Cloud-II.webp",
    driver: "53mm \ub124\uc624\ub514\ubbb4", freqResponse: "15 Hz - 25 kHz", impedance: "60 Ohms", sensitivity: "98 dB",
    officialUrl: "https://www.hyperxgaming.com/kr/headsets/cloud-ii-gaming-headset",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=HyperX%20Cloud%20II&channel=user",
  },
  "ASTRO A50": {
    brand: "Logitech", model: "ASTRO A50",
    image: "/images/equipments/103005_ASTRO_A50.webp",
    driver: "40mm \ub124\uc624\ub514\ubbb4", freqResponse: "20 Hz - 20 kHz", impedance: "33 Ohms", sensitivity: "118 dB SPL",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-audio/a50-gen-5-wireless-headset.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20ASTRO%20A50&channel=user",
  },
  "CORSAIR CG-Void Pro": {
    brand: "Corsair", model: "VOID RGB Elite",
    image: "/images/equipments/Corsair_VOID-RGB.webp",
    driver: "50mm \ub124\uc624\ub514\ubbb4", freqResponse: "20 Hz - 30 kHz", impedance: "32 Ohms", sensitivity: "116 dB",
    officialUrl: "https://www.corsair.com/kr/ko/p/headsets/ca-9011202-ap/void-rgb-elite-usb-premium-gaming-headset-with-7-1-surround-sound-carbon-ca-9011202-ap/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20VOID%20RGB%20Elite&channel=user",
  },
  "ROCCAT Syn Pro Air": {
    brand: "ROCCAT", model: "Syn Pro Air",
    image: "/images/equipments/ROCCAT_Syn-Pro-Air.webp",
    driver: "50mm \ub124\uc624\ub514\ubbb4", freqResponse: "20 Hz - 20 kHz", impedance: "32 Ohms", sensitivity: "112 dB",
    officialUrl: "https://www.roccat.com/products/syn-pro-air",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=ROCCAT%20Syn%20Pro%20Air&channel=user",
  },
  "Artisan Ninja FX Zero": {
    brand: "Artisan", model: "Zero",
    image: "/images/equipments/Artisan_Zero.webp",
    driver: "", freqResponse: "", impedance: "", sensitivity: "",
    officialUrl: "https://www.artisan-jp.com/fx-zero.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Artisan%20Zero&channel=user",
  },
  "CORSAIR MM350": {
    brand: "Corsair", model: "MM350",
    image: "/images/equipments/Corsair_MM350.webp",
    driver: "", freqResponse: "", impedance: "", sensitivity: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20MM350&channel=user",
  },
  "Logitech G640": {
    brand: "Logitech", model: "G640",
    image: "/images/equipments/Logitech_G640.webp",
    driver: "", freqResponse: "", impedance: "", sensitivity: "",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mouse-pads/g640-cloth-gaming-mouse-pad.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G640&channel=user",
  },
};

export const monitorDb: Record<string, MonitorSpec> = {
  "ZOWIE XL2540K": {
    brand: "Zowie", model: "XL2540K",
    image: "/images/equipments/Zowie_XL2540K.avif",
    refreshRate: "240Hz", size: "24.5\uc778\uce58", resolution: "1920x1080", panelType: "TN",
    officialUrl: "https://zowie.benq.com/ko-kr/monitor/xl2540k.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Zowie%20XL2540K&channel=user",
  },
  "ZOWIE XL2566K": {
    brand: "Zowie", model: "XL2566K",
    image: "/images/equipments/Zowie_XL2566K.webp",
    refreshRate: "360Hz", size: "24.5\uc778\uce58", resolution: "1920x1080", panelType: "Fast TN",
    officialUrl: "https://zowie.benq.com/ko-kr/monitor/xl2566k.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Zowie%20XL2566K&channel=user",
  },
  "ASUS ROG SWIFT PG258Q": {
    brand: "ASUS", model: "ROG SWIFT PG258Q",
    image: "/images/equipments/ASUS_ROG-PG258Q.webp",
    refreshRate: "240Hz", size: "24.5\uc778\uce58", resolution: "1920x1080", panelType: "TN",
    officialUrl: "https://rog.asus.com/monitors/below-25-inches/rog-swift-pg258q/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=ASUS%20ROG%20SWIFT%20PG258Q&channel=user",
  },
  "ASUS TUF VG259QM": {
    brand: "ASUS", model: "TUF VG259QM",
    image: "/images/equipments/ASUS_TUF-VG259QM.webp",
    refreshRate: "280Hz", size: "24.5\uc778\uce58", resolution: "1920x1080", panelType: "IPS",
    officialUrl: "https://www.asus.com/displays-desktops/monitors/tuf-gaming/tuf-gaming-vg259qm/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=ASUS%20TUF%20VG259QM&channel=user",
  },
  "ASUS TUF VG279QM": {
    brand: "ASUS", model: "TUF VG279QM",
    image: "/images/equipments/ASUS_TUF-VG279QM.webp",
    refreshRate: "280Hz", size: "27\uc778\uce58", resolution: "1920x1080", panelType: "IPS",
    officialUrl: "https://www.asus.com/displays-desktops/monitors/tuf-gaming/tuf-gaming-vg279qm/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=ASUS%20TUF%20VG279QM&channel=user",
  },
  "HP X27i": {
    brand: "HP", model: "X27i Gaming Monitor",
    image: "/images/equipments/HP_X27i.webp",
    refreshRate: "144Hz", size: "27\uc778\uce58", resolution: "2560x1440", panelType: "IPS",
    officialUrl: "https://www.hp.com",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=HP%20X27i%20Gaming%20Monitor&channel=user",
  },
  "LG 25GR75FG": {
    brand: "LG", model: "UltraGear 25GR75FG",
    image: "/images/equipments/LG_25GR75FG.webp",
    refreshRate: "360Hz", size: "24.5\uc778\uce58", resolution: "1920x1080", panelType: "IPS",
    officialUrl: "https://www.lg.com/kr/monitor/ultragear/25gr75fg-b.akor/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=LG%20UltraGear%2025GR75FG&channel=user",
  },
  "LG ULTRAGEAR 27GN750-B": {
    brand: "LG", model: "UltraGear 27GN750-B",
    image: "/images/equipments/LG_27GN750-B.webp",
    refreshRate: "240Hz", size: "27\uc778\uce58", resolution: "1920x1080", panelType: "IPS",
    officialUrl: "https://www.lg.com/kr/monitor/ultragear/27gn750/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=LG%20UltraGear%2027GN750-B&channel=user",
  },
  "LG UltraGear 27GR95QE-B": {
    brand: "LG", model: "UltraGear 27GR95QE-B",
    image: "/images/equipments/LG_27GR95QE-B.webp",
    refreshRate: "240Hz", size: "27\uc778\uce58", resolution: "2560x1440", panelType: "OLED",
    officialUrl: "https://www.lg.com/kr/monitor/ultragear/27gr95qe-b/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=LG%20UltraGear%2027GR95QE-B&channel=user",
  },
};

export const mousepadDb: Record<string, MousepadSpec> = {
  "Logitech G PowerPlay": {
    brand: "Logitech", model: "G PowerPlay",
    image: "/images/equipments/Logitech_G-PowerPlay.webp",
    size: "", surface: "\ud558\ub4dc/\ud074\ub85c\uc2a4 \uc591\uba74", thickness: "",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mouse-pads/powerplay-wireless-charging.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20PowerPlay&channel=user",
  },
  "Logitech G240": {
    brand: "Logitech", model: "G240",
    image: "/images/equipments/Logitech_G240.webp",
    size: "340x280mm", surface: "\ud074\ub85c\uc2a4", thickness: "1mm",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mouse-pads/g240-cloth-gaming-mouse-pad.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G240&channel=user",
  },
  "Logitech G640 Black": {
    brand: "Logitech", model: "G640",
    image: "/images/equipments/Logitech_G640.webp",
    size: "460x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "3mm",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mouse-pads/g640-cloth-gaming-mouse-pad.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G640&channel=user",
  },
  "Logitech G640 Original": {
    brand: "Logitech", model: "G640",
    image: "/images/equipments/Logitech_G640.webp",
    size: "460x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "3mm",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mouse-pads/g640-cloth-gaming-mouse-pad.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G640&channel=user",
  },
  "\ub85c\uc9c0\ud14d G640": {
    brand: "Logitech", model: "G640",
    image: "/images/equipments/Logitech_G640.webp",
    size: "460x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "3mm",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mouse-pads/g640-cloth-gaming-mouse-pad.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G640&channel=user",
  },
  "Logitech G840": {
    brand: "Logitech", model: "G840 XL",
    image: "/images/equipments/Logitech_G840.webp",
    size: "900x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "3mm",
    officialUrl: "https://www.logitechg.com/ko-kr/products/gaming-mouse-pads/g840-cloth-gaming-mouse-pad.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G840%20XL&channel=user",
  },
  "Razer Gigantus V2": {
    brand: "Razer", model: "Gigantus V2 L",
    image: "/images/equipments/Razer_Gigantus-V2.webp",
    size: "450x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "3mm",
    officialUrl: "https://www.razer.com/gaming-mouse-mats/razer-gigantus-v2",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Gigantus%20V2%20L&channel=user",
  },
  "\ub808\uc774\uc800 \uae30\uac04\ud22c\uc2a4 V2": {
    brand: "Razer", model: "Gigantus V2 L",
    image: "/images/equipments/Razer_Gigantus-V2.webp",
    size: "450x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "3mm",
    officialUrl: "https://www.razer.com/gaming-mouse-mats/razer-gigantus-v2",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Gigantus%20V2%20L&channel=user",
  },
  "Razer Gigantus V2 XXL": {
    brand: "Razer", model: "Gigantus V2 XXL",
    image: "/images/equipments/Razer_Gigantus-V2-XXL.webp",
    size: "940x410mm", surface: "\ud074\ub85c\uc2a4", thickness: "4mm",
    officialUrl: "https://www.razer.com/gaming-mouse-mats/razer-gigantus-v2",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Gigantus%20V2%20XXL&channel=user",
  },
  "Razer Goliathus Speed Cosmic": {
    brand: "Razer", model: "Goliathus Speed Cosmic",
    image: "/images/equipments/Razer_Goliathus-Speed.webp",
    size: "444x355mm", surface: "\ud074\ub85c\uc2a4 \uc2a4\ud53c\ub4dc", thickness: "",
    officialUrl: "https://www.razer.com/gaming-mouse-mats/razer-goliathus",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Goliathus%20Speed%20Cosmic&channel=user",
  },
  "\ub808\uc774\uc800 \uc2a4\ud2b8\ub77c\uc774\ub354": {
    brand: "Razer", model: "Strider L",
    image: "/images/equipments/Razer_Strider.webp",
    size: "450x400mm", surface: "\ud558\uc774\ube0c\ub9ac\ub4dc", thickness: "3mm",
    officialUrl: "https://www.razer.com/gaming-mouse-mats/razer-strider",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Strider%20L&channel=user",
  },
  "SteelSeries QcK Heavy": {
    brand: "SteelSeries", model: "QcK Heavy",
    image: "/images/equipments/SteelSeries_QcK-Heavy.webp",
    size: "450x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "6mm",
    officialUrl: "https://steelseries.com/gaming-mousepads/qck-heavy-series",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=SteelSeries%20QcK%20Heavy&channel=user",
  },
  "\uc2a4\ud2f8\uc2dc\ub9ac\uc988 QcK Heavy": {
    brand: "SteelSeries", model: "QcK Heavy",
    image: "/images/equipments/SteelSeries_QcK-Heavy.webp",
    size: "450x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "6mm",
    officialUrl: "https://steelseries.com/gaming-mousepads/qck-heavy-series",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=SteelSeries%20QcK%20Heavy&channel=user",
  },
  "CORSAIR MM300 Extended Gaming Mousepad": {
    brand: "Corsair", model: "MM300 Extended",
    image: "/images/equipments/Corsair_MM300.webp",
    size: "930x300mm", surface: "\ud074\ub85c\uc2a4", thickness: "3mm",
    officialUrl: "https://www.corsair.com/kr/ko/p/mouse-pads/ch-9000108-ww/mm300-anti-fray-cloth-gaming-mouse-pad-extended-ch-9000108-ww/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20MM300%20Extended&channel=user",
  },
  "Corsair MM PRO": {
    brand: "Corsair", model: "MM PRO",
    image: "/images/equipments/Corsair_MM-PRO.webp",
    size: "450x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "",
    officialUrl: "https://www.corsair.com/kr/ko/",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20MM%20PRO&channel=user",
  },
  "Custom Mousepad": {
    brand: "", model: "\ucee4\uc2a4\ud140 \ub9c8\uc6b0\uc2a4\ud328\ub4dc",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=%20%EC%BB%A4%EC%8A%A4%ED%85%80%20%EB%A7%88%EC%9A%B0%EC%8A%A4%ED%8C%A8%EB%93%9C&channel=user",
  },
  "ZOWIE G-SR II": {
    brand: "Zowie", model: "G-SR II",
    image: "/images/equipments/Zowie_G-SR-II.webp",
    size: "480x400mm", surface: "\ud074\ub85c\uc2a4 \ucee8\ud2b8\ub864", thickness: "3.5mm",
    officialUrl: "https://zowie.benq.com/ko-kr/mousepad/g-sr-ii.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Zowie%20G-SR%20II&channel=user",
  },
  "\uc870\uc704 G-SR II": {
    brand: "Zowie", model: "G-SR II",
    image: "/images/equipments/Zowie_G-SR-II.webp",
    size: "480x400mm", surface: "\ud074\ub85c\uc2a4 \ucee8\ud2b8\ub864", thickness: "3.5mm",
    officialUrl: "https://zowie.benq.com/ko-kr/mousepad/g-sr-ii.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Zowie%20G-SR%20II&channel=user",
  },
  "\uc870\uc704 G-SR-SE": {
    brand: "Zowie", model: "G-SR-SE",
    image: "/images/equipments/Zowie_G-SR-SE.webp",
    size: "480x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "3.5mm",
    officialUrl: "https://zowie.benq.com/ko-kr/mousepad/g-sr-se.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Zowie%20G-SR-SE&channel=user",
  },
  "\uc544\ud2f0\uc0b0 \uc81c\ub85c Soft": {
    brand: "Artisan", model: "Zero Soft",
    image: "/images/equipments/Artisan_Zero-Soft.webp",
    size: "420x330mm", surface: "\ud074\ub85c\uc2a4 \ubc38\ub7f0\uc2a4", thickness: "",
    officialUrl: "https://www.artisan-jp.com/fx-zero.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Artisan%20Zero%20Soft&channel=user",
  },
  "Artisan Ninja FX Zero": {
    brand: "Artisan", model: "Zero",
    image: "/images/equipments/Artisan_Zero-Soft.webp",
    size: "420x330mm", surface: "\ud074\ub85c\uc2a4 \ubc38\ub7f0\uc2a4", thickness: "",
    officialUrl: "https://www.artisan-jp.com/fx-zero.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Artisan%20Zero&channel=user",
  },
  "\uc544\ud2f0\uc0b0 \uc81c\ub85c XSoft": {
    brand: "Artisan", model: "Zero XSoft",
    image: "/images/equipments/Artisan_Zero-XSoft.webp",
    size: "420x330mm", surface: "\ud074\ub85c\uc2a4 \ubc38\ub7f0\uc2a4", thickness: "",
    officialUrl: "https://www.artisan-jp.com/fx-zero.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Artisan%20Zero%20XSoft&channel=user",
  },
  "\uc544\ud2f0\uc0b0 \ud558\uc57c\ud14c \uc624\uce20": {
    brand: "Artisan", model: "Hayate Otsu",
    image: "/images/equipments/Artisan_Hayate-Otsu.webp",
    size: "420x330mm", surface: "\ud074\ub85c\uc2a4 \uc2a4\ud53c\ub4dc", thickness: "",
    officialUrl: "https://www.artisan-jp.com/fx-hayate-otsu.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Artisan%20Hayate%20Otsu&channel=user",
  },
  "Pulsar PARA \ucee8\ud2b8\ub864 V2 (\ub808\ub4dc, L)": {
    brand: "Pulsar", model: "ParaControl V2",
    image: "/images/equipments/Pulsar_ParaControl-V2.webp",
    size: "450x400mm", surface: "\ud074\ub85c\uc2a4 \ucee8\ud2b8\ub864", thickness: "4mm",
    officialUrl: "https://www.pulsar.gg/products/paracontrol-v2",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Pulsar%20ParaControl%20V2&channel=user",
  },
  "\uc2a4\ud2f8 \ub2e8\ud328\ub4dc": {
    brand: "SteelSeries", model: "QcK",
    image: "/images/equipments/SteelSeries_QcK.webp",
    size: "320x270mm", surface: "\ud074\ub85c\uc2a4", thickness: "2mm",
    officialUrl: "https://steelseries.com/gaming-mousepads/qck-series",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=SteelSeries%20QcK&channel=user",
  },
  "\uc2a4\ud2f8 \uc7a5\ud328\ub4dc": {
    brand: "SteelSeries", model: "QcK XXL",
    image: "/images/equipments/SteelSeries_QcK-XXL.webp",
    size: "900x400mm", surface: "\ud074\ub85c\uc2a4", thickness: "4mm",
    officialUrl: "https://steelseries.com/gaming-mousepads/qck-series",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=SteelSeries%20QcK%20XXL&channel=user",
  },
  "RAZER \ub2e8\ud328\ub4dc": {
    brand: "Razer", model: "Gigantus V2 M",
    image: "/images/equipments/Razer_Gigantus-V2-M.webp",
    size: "360x275mm", surface: "\ud074\ub85c\uc2a4", thickness: "3mm",
    officialUrl: "https://www.razer.com/gaming-mouse-mats/razer-gigantus-v2",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Gigantus%20V2%20M&channel=user",
  },
  "RAZER \uc7a5\ud328\ub4dc": {
    brand: "Razer", model: "Gigantus V2 XXL",
    image: "/images/equipments/Razer_Gigantus-V2-XXL.webp",
    size: "940x410mm", surface: "\ud074\ub85c\uc2a4", thickness: "4mm",
    officialUrl: "https://www.razer.com/gaming-mouse-mats/razer-gigantus-v2",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Gigantus%20V2%20XXL&channel=user",
  },
  "BOB \ub2e8\ud328\ub4dc": {
    brand: "BOB", model: "\ub2e8\ud328\ub4dc",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=BOB%20%EB%8B%A8%ED%8C%A8%EB%93%9C&channel=user",
  },
  "BOB\ud328\ub4dc \ubc38\ub7f0\uc2a4": {
    brand: "BOB", model: "Balance",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=BOB%20Balance&channel=user",
  },
  "BenQ \uc911\ud328\ub4dc": {
    brand: "Zowie", model: "P-SR",
    image: "/images/equipments/Zowie_P-SR.webp",
    size: "355x315mm", surface: "\ud074\ub85c\uc2a4", thickness: "3.5mm",
    officialUrl: "https://zowie.benq.com/ko-kr/mousepad/p-sr.html",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Zowie%20P-SR&channel=user",
  },
  "CORSAIR VIRTUOSO": {
    brand: "Corsair", model: "VIRTUOSO",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Corsair%20VIRTUOSO&channel=user",
  },
  "Logitech G PRO X 2": {
    brand: "Logitech", model: "G Pro X 2 Mousepad",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Logitech%20G%20Pro%20X%202%20Mousepad&channel=user",
  },
  "KESPA \uccad\ud328\ub4dc": {
    brand: "KESPA", model: "\uccad\ud328\ub4dc",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=KESPA%20%EC%B2%AD%ED%8C%A8%EB%93%9C&channel=user",
  },
  "\uc6b0\ub07c\ub07c\uc988 \uc7a5\ud328\ub4dc": {
    brand: "Wookikiz", model: "\uc7a5\ud328\ub4dc",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Wookikiz%20%EC%9E%A5%ED%8C%A8%EB%93%9C&channel=user",
  },
  "\uc7a5\ud328\ub4dc": {
    brand: "", model: "\uc7a5\ud328\ub4dc (\ubbf8\uc0c1)",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=%20%EC%9E%A5%ED%8C%A8%EB%93%9C%20%28%EB%AF%B8%EC%83%81%29&channel=user",
  },
  "\uc911\ud328\ub4dc": {
    brand: "", model: "\uc911\ud328\ub4dc (\ubbf8\uc0c1)",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=%20%EC%A4%91%ED%8C%A8%EB%93%9C%20%28%EB%AF%B8%EC%83%81%29&channel=user",
  },
  "\ube68\uac04 \uc7a5\ud328\ub4dc": {
    brand: "", model: "\ube68\uac04 \uc7a5\ud328\ub4dc (\ubbf8\uc0c1)",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=%20%EB%B9%A8%EA%B0%84%20%EC%9E%A5%ED%8C%A8%EB%93%9C%20%28%EB%AF%B8%EC%83%81%29&channel=user",
  },
  "\ube68\uac04 \uc911\ud328\ub4dc": {
    brand: "", model: "\ube68\uac04 \uc911\ud328\ub4dc (\ubbf8\uc0c1)",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=%20%EB%B9%A8%EA%B0%84%20%EC%A4%91%ED%8C%A8%EB%93%9C%20%28%EB%AF%B8%EC%83%81%29&channel=user",
  },
  "\uc544\uc774\ud328\ub4dc \ub2e8\ud328\ub4dc": {
    brand: "", model: "\uc544\uc774\ud328\ub4dc \ub2e8\ud328\ub4dc (\ubbf8\uc0c1)",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=%20%EC%95%84%EC%9D%B4%ED%8C%A8%EB%93%9C%20%EB%8B%A8%ED%8C%A8%EB%93%9C%20%28%EB%AF%B8%EC%83%81%29&channel=user",
  },
  "\ucea1\ud2f4\uc544\uba54\ub9ac\uce74 \ub9c8\uc6b0\uc2a4\ud328\ub4dc": {
    brand: "", model: "\ucea1\ud2f4\uc544\uba54\ub9ac\uce74 \ub9c8\uc6b0\uc2a4\ud328\ub4dc (\ubbf8\uc0c1)",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=%20%EC%BA%A1%ED%8B%B4%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%20%EB%A7%88%EC%9A%B0%EC%8A%A4%ED%8C%A8%EB%93%9C%20%28%EB%AF%B8%EC%83%81%29&channel=user",
  },
  "\ucf00\uc774\ud14d \uc74c\uc774\uc628 \uccad\ud328\ub4dc": {
    brand: "K-Tech", model: "\uc74c\uc774\uc628 \uccad\ud328\ub4dc",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=K-Tech%20%EC%9D%8C%EC%9D%B4%EC%98%A8%20%EC%B2%AD%ED%8C%A8%EB%93%9C&channel=user",
  },
  "\ucf00\uc774\ud14d \uccad\ud328\ub4dc": {
    brand: "K-Tech", model: "\uccad\ud328\ub4dc",
    image: "",
    size: "", surface: "", thickness: "",
    officialUrl: "",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=K-Tech%20%EC%B2%AD%ED%8C%A8%EB%93%9C&channel=user",
  },
};

export const chairDb: Record<string, ChairSpec> = {
  "Secretlab T1 Edition": {
    brand: "Secretlab", model: "TITAN Evo T1 Edition",
    image: "/images/equipments/Secretlab_TITAN-T1.webp",
    officialUrl: "https://secretlab.co.kr/collections/titan-evo/products/titan-evo-2022-series-t1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Secretlab%20TITAN%20Evo%20T1%20Edition&channel=user",
  },
  "Secretlab T1 Ed.": {
    brand: "Secretlab", model: "TITAN Evo T1 Edition",
    image: "/images/equipments/Secretlab_TITAN-T1.webp",
    officialUrl: "https://secretlab.co.kr/collections/titan-evo/products/titan-evo-2022-series-t1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Secretlab%20TITAN%20Evo%20T1%20Edition&channel=user",
  },
  "Secretlab x T1 Gaming Chair": {
    brand: "Secretlab", model: "TITAN Evo T1 Edition",
    image: "/images/equipments/Secretlab_TITAN-T1.webp",
    officialUrl: "https://secretlab.co.kr/collections/titan-evo/products/titan-evo-2022-series-t1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Secretlab%20TITAN%20Evo%20T1%20Edition&channel=user",
  },
  "Secretlab TITAN": {
    brand: "Secretlab", model: "TITAN",
    image: "/images/equipments/Secretlab_TITAN.webp",
    officialUrl: "https://secretlab.co.kr/collections/titan-evo",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Secretlab%20TITAN&channel=user",
  },
  "Secretlab TITAN Evo": {
    brand: "Secretlab", model: "TITAN Evo",
    image: "/images/equipments/Secretlab_TITAN-Evo.webp",
    officialUrl: "https://secretlab.co.kr/collections/titan-evo",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Secretlab%20TITAN%20Evo&channel=user",
  },
  "Razer Iskur V2": {
    brand: "Razer", model: "Iskur V2",
    image: "/images/equipments/Razer_Iskur-V2.webp",
    officialUrl: "https://www.razer.com/gaming-chairs/razer-iskur-v2",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Razer%20Iskur%20V2&channel=user",
  },
  "\uc2dc\ub514\uc988 T50": {
    brand: "Sidiz", model: "T50",
    image: "/images/equipments/Sidiz_T50.webp",
    officialUrl: "https://www.sidiz.com/product/t50",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Sidiz%20T50&channel=user",
  },
  "\uc2dc\ub514\uc988 T80": {
    brand: "Sidiz", model: "T80",
    image: "/images/equipments/Sidiz_T80.webp",
    officialUrl: "https://www.sidiz.com/product/t80",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Sidiz%20T80&channel=user",
  },
};

export const deskDb: Record<string, DeskSpec> = {
  "LunaLab Motion Desk Dual Motor": {
    brand: "LunaLab", model: "Motion Desk Dual Motor",
    image: "/images/equipments/Lunalab_motiondesk-dualmotor.jpg",
    officialUrl: "https://lunalab.co.kr/desk/?idx=1",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=LunaLab%20Motion%20Desk%20Dual%20Motor&channel=user",
  },
  "Secretlab MAGNUS Pro": {
    brand: "Secretlab", model: "MAGNUS Pro",
    image: "/images/equipments/Secretlab_MAGNUS-Pro.webp",
    officialUrl: "https://secretlab.co.kr/collections/magnus-metal-desk",
    coupangUrl: "https://www.coupang.com/np/search?component=&q=Secretlab%20MAGNUS%20Pro&channel=user",
  },
};

// Lookup helpers
function resolveStaticSpec(db: Record<string, unknown>, name: string) {
  if (db[name]) return db[name];
  const keys = Object.keys(db);
  const resolved = resolveCanonicalEquipmentKey(name, keys);
  if (resolved && db[resolved]) return db[resolved];
  const normalized = normalizeEquipmentLabel(name);
  const matchKey = keys.find((k) => normalizeEquipmentLabel(k) === normalized);
  return matchKey ? db[matchKey] : undefined;
}

export function getMouseSpec(name: string): MouseSpec | undefined {
  return resolveStaticSpec(mouseDb as Record<string, unknown>, name) as MouseSpec | undefined;
}
export function getKeyboardSpec(name: string): KeyboardSpec | undefined {
  return resolveStaticSpec(keyboardDb as Record<string, unknown>, name) as KeyboardSpec | undefined;
}
export function getHeadsetSpec(name: string): HeadsetSpec | undefined {
  return resolveStaticSpec(headsetDb as Record<string, unknown>, name) as HeadsetSpec | undefined;
}
export function getMonitorSpec(name: string): MonitorSpec | undefined {
  return resolveStaticSpec(monitorDb as Record<string, unknown>, name) as MonitorSpec | undefined;
}
export function getMousepadSpec(name: string): MousepadSpec | undefined {
  return resolveStaticSpec(mousepadDb as Record<string, unknown>, name) as MousepadSpec | undefined;
}
export function getChairSpec(name: string): ChairSpec | undefined {
  return resolveStaticSpec(chairDb as Record<string, unknown>, name) as ChairSpec | undefined;
}
export function getDeskSpec(name: string): DeskSpec | undefined {
  return resolveStaticSpec(deskDb as Record<string, unknown>, name) as DeskSpec | undefined;
}

export function getEquipmentSpec(type: string, name: string) {
  switch (type) {
    case "\ub9c8\uc6b0\uc2a4": return getMouseSpec(name);
    case "\ud0a4\ubcf4\ub4dc": return getKeyboardSpec(name);
    case "\ud5e4\ub4dc\uc14b": return getHeadsetSpec(name);
    case "\ubaa8\ub2c8\ud130": return getMonitorSpec(name);
    case "\ub9c8\uc6b0\uc2a4\ud328\ub4dc": return getMousepadSpec(name);
    case "\uc758\uc790": return getChairSpec(name);
    case "\ucc45\uc0c1": return getDeskSpec(name);
    default: return undefined;
  }
}

// ── Dynamic equipment fetching from Supabase ─────────────────────────────────
import { createBrowserClient } from '@supabase/ssr';

// In-memory cache for equipment specs { category → { name → spec } }
const supabaseEquipCache: Record<string, Record<string, any>> = {};
const supabaseEquipByKey: Record<string, any> = {};
const supabaseEquipById: Record<number, any> = {};
let cacheLoaded = false;

function normalizeCategorySlug(category: string | null | undefined): string {
  return (category || "other").trim().toLowerCase();
}

function getAllCatalogKeys(): string[] {
  return Object.keys(supabaseEquipByKey);
}

function buildCategoryKeyToId(
  catCache: Record<string, any> | undefined,
): Map<string, number> {
  const keyToId = new Map<string, number>();
  if (!catCache) return keyToId;
  for (const [key, row] of Object.entries(catCache)) {
    if (typeof row?.id === "number") keyToId.set(key, row.id);
  }
  return keyToId;
}

/** Fuzzy match player/catalog labels (edition, color, Korean variants). */
function findFuzzyCatalogRow(
  category: string,
  name: string,
): { key: string; row: any } | undefined {
  const cat = normalizeCategorySlug(category);
  const catCache = supabaseEquipCache[cat];
  if (!catCache) return undefined;

  const catalogKeys = Object.keys(catCache);
  const keyToId = buildCategoryKeyToId(catCache);

  for (const catalogKey of catalogKeys) {
    if (equipmentLabelsMatch(name, catalogKey, catalogKeys, keyToId)) {
      return { key: catalogKey, row: catCache[catalogKey] };
    }
  }

  return undefined;
}

function findAffiliateInCatalog(category: string, name: string): string | null {
  const cat = normalizeCategorySlug(category);
  const catCache = supabaseEquipCache[cat];
  if (!catCache) return null;

  const catalogKeys = Object.keys(catCache);
  const keyToId = buildCategoryKeyToId(catCache);

  for (const catalogKey of catalogKeys) {
    if (!equipmentLabelsMatch(name, catalogKey, catalogKeys, keyToId)) continue;
    const url = pickAffiliateUrl(catCache[catalogKey]);
    if (url) return url;
  }

  return null;
}

function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export async function loadEquipmentFromSupabase(): Promise<void> {
  if (cacheLoaded) return;
  
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('equipment_info')
    .select('*')
    .order('id');

  if (error) {
    console.error('Failed to load equipment from Supabase:', error);
    return;
  }

  for (const row of data || []) {
    const cat = normalizeCategorySlug(row.category);
    if (!supabaseEquipCache[cat]) supabaseEquipCache[cat] = {};
    supabaseEquipCache[cat][row.key] = row;
    if (row.key) supabaseEquipByKey[row.key] = row;
    if (typeof row.id === "number") supabaseEquipById[row.id] = row;
  }
  
  cacheLoaded = true;
}

export function getSupabaseEquipmentSpec(category: string, key: string): any | undefined {
  const cat = normalizeCategorySlug(category);
  const catCache = supabaseEquipCache[cat];
  const allKeys = getAllCatalogKeys();

  if (catCache) {
    const keys = Object.keys(catCache);
    const resolvedKey = resolveCanonicalEquipmentKey(key, keys);
    if (resolvedKey) return catCache[resolvedKey];
  }

  if (allKeys.length > 0) {
    const resolvedKey = resolveCanonicalEquipmentKey(key, allKeys);
    if (resolvedKey) return supabaseEquipByKey[resolvedKey];
  }

  const exactKey = allKeys.find((dbKey) => dbKey.toLowerCase() === key.toLowerCase());
  if (exactKey) return supabaseEquipByKey[exactKey];

  const fuzzy = findFuzzyCatalogRow(category, key);
  return fuzzy?.row;
}

export function getSupabaseEquipmentById(id: number): any | undefined {
  return supabaseEquipById[id];
}

export function catalogRowMatchesCategory(
  row: { category?: string | null } | undefined,
  category: string,
): boolean {
  if (!row) return false;
  return normalizeCategorySlug(row.category) === normalizeCategorySlug(category);
}

export function getSupabaseEquipmentByIdForCategory(
  id: number,
  category: string,
): any | undefined {
  const row = getSupabaseEquipmentById(id);
  return catalogRowMatchesCategory(row, category) ? row : undefined;
}

function pickAffiliateUrl(raw: { affiliate_url?: string | null } | undefined): string | null {
  const url = raw?.affiliate_url?.trim();
  return url ? url : null;
}

/** Resolve Coupang Partners affiliate_url from Supabase catalog (by id or name). */
export function resolveEquipmentAffiliateUrl(
  category: string,
  name: string,
  catalogId?: number | null,
): string | null {
  if (catalogId != null) {
    const byIdRow = getSupabaseEquipmentByIdForCategory(catalogId, category);
    const byId = pickAffiliateUrl(byIdRow);
    if (byId) return byId;
    if (byIdRow?.key) {
      const fromKey = findAffiliateInCatalog(category, byIdRow.key);
      if (fromKey) return fromKey;
    }
  }

  const byName = pickAffiliateUrl(getSupabaseEquipmentSpec(category, name));
  if (byName) return byName;

  return findAffiliateInCatalog(category, name);
}

/** Resolve player-side equipment label to canonical catalog key for URLs. */
export function resolveEquipmentLinkKey(category: string, name: string): string {
  const typeKey = normalizeCategorySlug(category);
  const catCache = supabaseEquipCache[typeKey];
  const staticKeys = getStaticCatalogKeysForCategory(typeKey);
  const mergedKeys = [
    ...new Set([
      ...(catCache ? Object.keys(catCache) : []),
      ...staticKeys,
      ...getAllCatalogKeys(),
    ]),
  ];

  if (mergedKeys.length > 0) {
    const resolved = resolveCanonicalEquipmentKey(name, mergedKeys);
    if (resolved) return resolved;
  }

  const fuzzy = findFuzzyCatalogRow(typeKey, name);
  if (fuzzy) return fuzzy.key;

  return name.trim();
}

/** Link key for a player equipment row — validates catalog id category before use. */
export function resolvePlayerEquipmentLinkKey(
  category: string,
  name: string,
  catalogId?: number | null,
): string {
  if (catalogId != null) {
    const byId = getSupabaseEquipmentByIdForCategory(catalogId, category);
    if (byId?.key) return byId.key;
  }
  return resolveEquipmentLinkKey(category, name);
}

const categoryKrLabel: Record<string, string> = {
  mouse: "마우스",
  keyboard: "키보드",
  headset: "헤드셋",
  monitor: "모니터",
  mousepad: "마우스패드",
  chair: "의자",
  desk: "책상",
};

export function getStaticCatalogKeysForCategory(category: string): string[] {
  const kr = categoryKrLabel[normalizeCategorySlug(category)];
  if (!kr) return [];
  switch (kr) {
    case "마우스":
      return Object.keys(mouseDb);
    case "키보드":
      return Object.keys(keyboardDb);
    case "헤드셋":
      return Object.keys(headsetDb);
    case "모니터":
      return Object.keys(monitorDb);
    case "마우스패드":
      return Object.keys(mousepadDb);
    case "의자":
      return Object.keys(chairDb);
    case "책상":
      return Object.keys(deskDb);
    default:
      return [];
  }
}

/** Image paths indexed by equipment_info.id (from `{id}_*.webp` filenames). */
let equipmentImagesById: Record<number, string> | null = null;

function ensureEquipmentImagesById(): Record<number, string> {
  if (equipmentImagesById) return equipmentImagesById;
  equipmentImagesById = {};
  for (const path of Object.values(equipmentImages)) {
    const match = path.match(/\/(\d+)_/);
    if (match) equipmentImagesById[parseInt(match[1], 10)] = path;
  }
  return equipmentImagesById;
}

export function getImageByCatalogId(catalogId: number | null | undefined): string {
  if (catalogId == null) return "";
  return ensureEquipmentImagesById()[catalogId] ?? "";
}

/** Resolve image URL — tries catalog key, player label, aliases, normalized keys, static DB. */
export function resolveEquipmentImageUrl(category: string, ...names: string[]): string {
  const uniqNames = [...new Set(names.filter(Boolean))];

  for (const n of uniqNames) {
    if (equipmentImages[n]) return equipmentImages[n];
  }

  const lookupKeys = [
    ...new Set([...getAllCatalogKeys(), ...getStaticCatalogKeysForCategory(category)]),
  ];

  for (const n of uniqNames) {
    if (lookupKeys.length === 0) break;
    const resolved = resolveCanonicalEquipmentKey(n, lookupKeys);
    if (resolved && equipmentImages[resolved]) return equipmentImages[resolved];
  }

  for (const n of uniqNames) {
    const norm = normalizeEquipmentLabel(n);
    for (const [key, path] of Object.entries(equipmentImages)) {
      if (normalizeEquipmentLabel(key) === norm) return path;
    }
  }

  return "";
}

/** Look up equipment image from hardcoded mapping, with static DB fallback. */
export function getEquipmentImage(category: string, name: string): string {
  return resolveEquipmentImageUrl(category, name);
}

/** Check if an equipment has a valid image mapping (used to filter player equipment icons) */
export function hasEquipmentImage(category: string, key: string): boolean {
  return getEquipmentImage(category, key) !== "";
}

/** Get equipment spec as a plain object suitable for EquipmentCard display */
export function formatEquipmentSpec(
  raw: any,
  typeLabel: string,
  extraNames: string[] = [],
): Record<string, any> | null {
  if (!raw) return null;

  const staticImage =
    getImageByCatalogId(typeof raw.id === "number" ? raw.id : null) ||
    resolveEquipmentImageUrl(typeLabel, raw.key || "", ...extraNames);
  
  return {
    _type: typeLabel,
    brand: raw.brand || '',
    model: raw.model || '',
    image: staticImage || '',
    connection: raw.connection || '',
    weight: raw.weight || '',
    sensor: raw.sensor || '',
    dpi: raw.dpi || '',
    switchType: raw.switchType || raw.switchtype || '',
    layout: raw.layout || '',
    driver: raw.driver || '',
    freqResponse: raw.freqResponse || raw.freqresponse || '',
    impedance: raw.impedance || '',
    sensitivity: raw.sensitivity || '',
    size: raw.size || '',
    resolution: raw.resolution || '',
    panelType: raw.panelType || raw.paneltype || '',
    refreshRate: raw.refreshRate || raw.refreshrate || '',
    surface: raw.material || '',
    thickness: '',
    officialUrl: raw.officialUrl || raw.officialurl || '',
    coupangUrl: raw.coupangUrl || raw.coupangurl || '',
    affiliate_url: raw.affiliate_url || null,
  };
}

/** Look up equipment image from hardcoded mapping */
function findStaticImage(category: string, key: string): string | undefined {
  return equipmentImages[key];
}

export const equipmentImages: Record<string, string> = {
  "Abko Hacker K985P": "/images/equipments/102031_Hacker_K985P.webp",
  "AQUA Control Plus Super": "/images/equipments/105028_AQUA_Control_Plus_Super.webp",
  "Artisan FX Hien XSoft Wine Red": "/images/equipments/105029_Artisan_FX_Hien_XSoft_Wine_Red.webp",
  "Artisan Hayate Otsu": "/images/equipments/105021_Hayate_Otsu.webp",
  "Artisan Ninja FX Zero": "/images/equipments/105019_Zero.webp",
  "Artisan Ninja FX Zero X Soft": "/images/equipments/105019_Zero.webp",
  "Artisan NINJA FX99": "/images/equipments/105030_Artisan_NINJA_FX99.webp",
  "Artisan Type-99 Soft Black": "/images/equipments/105031_Artisan_Type-99_Soft_Black.webp",
  "Artisan Zero": "/images/equipments/105032_Artisan_Zero.webp",
  "Artisan Zero, Hien": "/images/equipments/105033_Artisan_Zero_Hien.webp",
  "ASUS ROG Falchion Ace 75 HE Black": "/images/equipments/102036_ASUS_ROG_Falchion_Ace_75_HE_Black.webp",
  "Asus ROG SWIFT PG258Q": "/images/equipments/104003_ROG_SWIFT_PG258Q.webp",
  "Asus TUF VG259QM": "/images/equipments/104004_TUF_VG259QM.webp",
  "Asus TUF VG279QM": "/images/equipments/104005_TUF_VG279QM.webp",
  "AULA F87 Pro": "/images/equipments/102037_AULA_F87_Pro.webp",
  "beyerdynamic DT 770 Pro": "/images/equipments/103023_beyerdynamic_dt_770_pro.webp",
  "BOB Balance": "/images/equipments/105023_Balance.webp",
  "Bose QuietComfort 20": "/images/equipments/103017_Bose_QuietComfort_20.webp",
  "Bravotec Marvel Captain America mousepad XL": "/images/equipments/105027_Marvel_Captain_America_mousepad_XL.webp",
  "CHERRY G80-3000S RGB": "/images/equipments/102038_CHERRY_G80-3000S_RGB.webp",
  "CHERRY MX Board 3.0 TKL": "/images/equipments/102039_CHERRY_MX_Board_3.0_TKL.webp",
  "Commatech FK MINI 2": "/images/equipments/101036_FK_MINI_2.webp",
  "Commatech FK MINI 3": "/images/equipments/101036_FK_MINI_2.webp",
  "Commatech FK MINI 3 Rugbi Ball": "/images/equipments/101038_FK_MINI_3.webp",
  "Commatech FK Mini 4": "/images/equipments/101044_Commatech_FK_Mini_4.webp",
  "Corsair CG-Void PRO": "/images/equipments/103010_VOID_RGB_Elite.webp",
  "Corsair HS80 RGB USB": "/images/equipments/103018_Corsair_HS80_RGB_USB.webp",
  "Corsair K70 RAPIDFIRE Mechanical Gaming Keyboard": "/images/equipments/102041_Corsair_K70_RAPIDFIRE.webp",
  "Corsair K70 RGB MK.2": "/images/equipments/102020_K70_RGB_MK.2.webp",
  "Corsair K70 RGB MK.2 SE": "/images/equipments/102020_K70_RGB_MK.2.webp",
  "Corsair K70 RGB PRO": "/images/equipments/102018_K70_RGB_PRO.webp",
  "Corsair K70 RGB TKL": "/images/equipments/102019_K70_RGB_TKL.webp",
  "Corsair M75 AIR": "/images/equipments/101030_M75_AIR.webp",
  "Corsair MM PRO": "/images/equipments/105013_MM350.webp",
  "Corsair MM300 Extended": "/images/equipments/105014_MM300_EXtended.webp",
  "Corsair MM300 EXtended Gaming Mousepad": "/images/equipments/105014_MM300_EXtended.webp",
  "Corsair MM350": "/images/equipments/105013_MM350.webp",
  "Corsair Sabre V2 PRO CF": "/images/equipments/101031_Sabre_RGB_PRO_Champion.webp",
  "Corsair Vanguard PRO 96": "/images/equipments/102017_K70_PRO.webp",
  "Corsair Vanguard Pro 96": "/images/equipments/102042_Corsair_Vanguard_Pro_96.webp",
  "Corsair VIRTUOSO": "/images/equipments/103011_VIRTUOSO.webp",
  "Corsair VIRTUOSO Max": "/images/equipments/103012_Syn_PRO_Air.webp",
  "Corsair VOID RGB Elite": "/images/equipments/103011_VIRTUOSO.webp",
  "COX Endeavor White": "/images/equipments/102040_COX_Endeavor_White.webp",
  "Custom Keyboard Frog F12 WK Cream Barebone": "/images/equipments/102066_Custom Keyboard Frog F12 WK Cream Barebone.webp",
  "DAREU A87 Pro 8K": "/images/equipments/102044_DAREU_A87_Pro_8K.webp",
  "Deck CBL-108XN(헤슘 거북선)": "/images/equipments/102045_Deck_CBL-108XN_Hassium_Geobukseon.webp",
  "Deck CBL-108XNW(헤슘 한산)": "/images/equipments/102046_Deck_CBL-108XNW_Hassium_Hansan.webp",
  "Deck CBL-87XN(프랑슘 거북선)": "/images/equipments/102047_Deck_CBL-87XN_Francium_Geobukseon.webp",
  "Deck CBL-87XN(프랑슘 한산)": "/images/equipments/102048_Deck_CBL-87XN_Francium_Hansan.webp",
  "Deck Francium Hansan 108XNW": "/images/equipments/102022_Francium_Hansan_108XNW.webp",
  "Filco Majestouch 2": "/images/equipments/102023_Majestouch_2.webp",
  "Filco Majestouch 2 TKL": "/images/equipments/102023_Majestouch_2.webp",
  "Finalmouse Ultralight X Medium": "/images/equipments/101045_Finalmouse_Ultralight_X_Medium.webp",
  "G915 TKL X Linear": "/images/equipments/102049_G915_TKL_X_Linear.webp",
  "HP X27i": "/images/equipments/104006_X27i_Gaming_Monitor.webp",
  "HyperX Alloy FPS Pro": "/images/equipments/102050_hyperx_alloy_fps_pro.webp",
  "HyperX Cloud Flight S": "/images/equipments/103013_Cloud_Flight_S.webp",
  "HyperX Cloud II": "/images/equipments/103014_Cloud_II.webp",
  "HyperX FURY S PRO Speed": "/images/equipments/105036_hyperx_fury_s_pro_speed.webp",
  "HyperX Pulsefire": "/images/equipments/105037_hyperx_pulsefire.webp",
  "K-Tech Negative Ion Mouse Pad": "/images/equipments/105025_Negative_Ion_Mouse_Pad.webp",
  "KeSPA Negative Ion Mouse Pad": "/images/equipments/105024_Negative_Ion_Mouse_Pad.webp",
  "LAMZU ATLANTIS MINI PRO": "/images/equipments/101039_Atlantis_mini_pro.webp",
  "LAMZU Atlantis Original V2 Pro": "/images/equipments/101047_LAMZU_Atlantis_Original_V2_Pro.webp",
  "LAMZU Maya 4K Compitable": "/images/equipments/101048_LAMZU_Maya_4K_Compitable.webp",
  "Leopold FC750R": "/images/equipments/102029_FC750R.webp",
  "Leopold FC750RBT PD": "/images/equipments/102030_FC750RBT_PD.webp",
  "Leopold FC900R": "/images/equipments/102051_leopold_fc900r.webp",
  "Leopold FC900RBT": "/images/equipments/102052_leopold_fc900rbt.webp",
  "Lethal Gaming Gear Saturn PRO": "/images/equipments/105038_pulsar_Gaming_Gear_Saturn_PRO.webp",
  "LG 25GR75FG": "/images/equipments/104007_UltraGear_25GR75FG.webp",
  "LG UltraGear 27GN750-B": "/images/equipments/104008_UltraGear_27GN750-B.webp",
  "LG UltraGear 27GR95QE-B": "/images/equipments/104009_UltraGear_27GR95QE-B.webp",
  "Logitech ASTRO A50": "/images/equipments/103005_ASTRO_A50.webp",
  "Logitech G PowerPlay": "/images/equipments/105001_G_PowerPlay.webp",
  "Logitech G PRO": "/images/equipments/101001_G_PRO_Gaming_Mouse.webp",
  "Logitech G PRO 2 LIGHTSPEED": "/images/equipments/101003_G_PRO2_LIGHTSPEED.webp",
  "Logitech G PRO Wireless": "/images/equipments/101001_G_PRO_Gaming_Mouse.webp",
  "Logitech G PRO X": "/images/equipments/103001_G_PRO_X.webp",
  "Logitech G PRO X 2": "/images/equipments/103001_G_PRO_X.webp",
  "Logitech G PRO X Mechanical Keyboard": "/images/equipments/102001_G_PRO_X_Mechanical_Keyboard.webp",
  "Logitech G Pro X Keyboard": "/images/equipments/102001_G_PRO_X_Mechanical_Keyboard.webp",
  "ASTRO A50": "/images/equipments/103005_ASTRO_A50.webp",
  "로지텍 G PRO X 기계식 키보드": "/images/equipments/102001_G_PRO_X_Mechanical_Keyboard.webp",
  "Logitech G PRO X SUPERLIGHT": "/images/equipments/101004_G_PRO_X_SUPERLIGHT.webp",
  "Logitech G PRO X SUPERLIGHT 2": "/images/equipments/101004_G_PRO_X_SUPERLIGHT.webp",
  "Logitech G PRO X SUPERLIGHT 2 DEX": "/images/equipments/101004_G_PRO_X_SUPERLIGHT.webp",
  "Logitech G PRO X SUPERLIGHT 2 SE": "/images/equipments/101007_G_PRO_X_SUPERLIGHT_2_SE.webp",
  "Logitech G PRO X SUPERLIGHT 2C": "/images/equipments/101006_G_PRO_X_SUPERLIGHT_2C.webp",
  "Logitech G PRO X TKL": "/images/equipments/102002_G_PRO_X_TKL.webp",
  "Logitech G PRO X2 SUPERSTRIKE": "/images/equipments/101009_G_PRO_X2_SUPERSTRIKE.webp",
  "Logitech G102": "/images/equipments/101017_G102.webp",
  "Logitech G240": "/images/equipments/105002_G240.webp",
  "Logitech G303 Shroud Edition": "/images/equipments/101015_G303_Shroud_Edition.webp",
  "Logitech G304 Lightspeed": "/images/equipments/101019_G304_Lightspeed.webp",
  "Logitech G305": "/images/equipments/101016_G305.webp",
  "Logitech G403": "/images/equipments/101010_G403.webp",
  "Logitech G413": "/images/equipments/102053_logitech_g413.webp",
  "Logitech G502 X": "/images/equipments/101011_G502_X.webp",
  "Logitech G502 X LIGHTSPEED": "/images/equipments/101011_G502_X.webp",
  "Logitech G512": "/images/equipments/102003_G512.webp",
  "Logitech G513 Carbon Mechanical Gaming Keyboard": "/images/equipments/102054_Logitech_G513_Carbon.webp",
  "Logitech G513 Wired Gaming Keyboard": "/images/equipments/102004_G513_Wired_Gaming_Keyboard.webp",
  "Logitech G610 ORION BLUE": "/images/equipments/102005_G610_Orion.webp",
  "Logitech G640": "/images/equipments/105003_G640.webp",
  "Logitech G703": "/images/equipments/101013_G703.webp",
  "Logitech G715": "/images/equipments/102006_G715.webp",
  "Logitech G733": "/images/equipments/103004_G733.webp",
  "Logitech G840 XL": "/images/equipments/105004_G840_XL.webp",
  "Logitech G903": "/images/equipments/101014_G903.webp",
  "Logitech G913 TKL": "/images/equipments/102007_G913_TKL.webp",
  "Logitech G915 TKL Carbon": "/images/equipments/102055_logitech_g915_tkl_carbon.webp",
  "Logitech G915 X": "/images/equipments/102008_G915.webp",
  "Logitech G915 X LIGTHSPEED TKL": "/images/equipments/102008_G915.webp",
  "Logitech Mini Optical": "/images/equipments/101018_Mini_Optical_(M187).webp",
  "LunaLab Motion Desk Dual Motor": "/images/equipments/107001_Motion_Desk_Dual_Motor.webp",
  "Microsoft wheel mouse": "/images/equipments/101043_Wheel_mouse.webp",
  "Pulsa ParaControl": "/images/equipments/105039_pulsar_paracontrol.webp",
  "Pulsa ParaControl V2 Black": "/images/equipments/105040_pulsar_paracontrol_v2_black.webp",
  "Pulsar eS Saturn Pro Black": "/images/equipments/105041_pulsar_es_saturn_pro_black.webp",
  "Pulsar eS Saturn Pro Red": "/images/equipments/105042_pulsar_es_saturn_pro_red.webp",
  "Pulsar ParaControl V2": "/images/equipments/105022_ParaControl_V2.webp",
  "Qsenn DT-35": "/images/equipments/102028_DT-35.webp",
  "Qsenn Q87 PBT": "/images/equipments/102056_Qsenn_Q87_PBT.webp",
  "Qsenn SEM DT-35": "/images/equipments/102057_Qsenn_SEM_DT-35.webp",
  "Qsenn SEM DT-35 87": "/images/equipments/102058_Qsenn_SEM_DT-35_87.webp",
  "Qsenn SEM DT-35 87 PBT": "/images/equipments/102059_Qsenn_SEM_DT-35_87_PBT.webp",
  "Qsenn SEM DT-35 Stella LED": "/images/equipments/102060_Qsenn_SEM_DT-35_Stella_LED.webp",
  "Razer BlackShark V2": "/images/equipments/103006_BlackShark_V2.webp",
  "Razer BlackShark V2 PRO": "/images/equipments/103006_BlackShark_V2.webp",
  "Razer BlackShark V3 PRO": "/images/equipments/103008_BlackShark_V3_PRO.webp",
  "Razer BlackShark V3 PRO White": "/images/equipments/103010_VOID_RGB_Elite.webp",
  "Razer Blackwidow Lite": "/images/equipments/102016_BlackWidow_Lite.webp",
  "Razer Blackwidow Ultimate": "/images/equipments/102015_Blackwidow_Ultimate.webp",
  "Razer BlackWidow V3 PRO": "/images/equipments/102014_BlackWidow_V3_PRO.webp",
  "Razer Deathadder V2 PRO": "/images/equipments/101026_DeathAdder_V2_PRO.webp",
  "Razer DeathAdder V3 PRO": "/images/equipments/101027_DeathAdder_V3_PRO.webp",
  "Razer DeathAdder V4 PRO": "/images/equipments/101028_DeathAdder_V3_PRO.webp",
  "Razer Gigantus V2 L": "/images/equipments/105005_Gigantus_V2_M.webp",
  "Razer Gigantus V2 M": "/images/equipments/105005_Gigantus_V2_M.webp",
  "Razer Gigantus V2 XXL": "/images/equipments/105007_Gigantus_V2_XXL.webp",
  "RAZER Goliathus": "/images/equipments/105043_razer_goliathus.webp",
  "Razer Goliathus Speed Cosmic": "/images/equipments/105008_Goliathus_Speed_Cosmic.webp",
  "Razer Huntsman Elite": "/images/equipments/102013_Huntsman_Elite.webp",
  "Razer Huntsman TE": "/images/equipments/102061_razer_huntsman_te.webp",
  "Razer Huntsman V3 PRO": "/images/equipments/102010_Huntsman_V3_PRO.webp",
  "Razer Huntsman V3 PRO TKL": "/images/equipments/102010_Huntsman_V3_PRO.webp",
  "Razer Huntsman V3 PRO TKL 8KHz": "/images/equipments/102010_Huntsman_V3_PRO.webp",
  "Razer Iskur V2": "/images/equipments/106003_Iskur_V2.webp",
  "Razer Kraken V3 PRO": "/images/equipments/103009_Kraken_V3_PRO.webp",
  "Razer OROCHI V2": "/images/equipments/101029_OROCHI_V2.webp",
  "Razer Strider L": "/images/equipments/105009_Strider_L.webp",
  "Razer VIPER 8KHz": "/images/equipments/101024_Viper_8KHz.webp",
  "Razer VIPER Mini Signature Edition": "/images/equipments/101025_Viper_Mini_Signature_Edition.webp",
  "Razer Viper V3 Hyperspeed": "/images/equipments/101049_Razer_Viper_V3_Hyperspeed.webp",
  "Razer VIPER V3 PRO": "/images/equipments/101020_Viper_V3_PRO.webp",
  "Razer VIPER V3 PRO FAKER EDITION": "/images/equipments/101020_Viper_V3_PRO.webp",
  "Razer VIPER V3 PRO SE": "/images/equipments/101022_Viper_V3_PRO_SE.webp",
  "Razer VIPER V4 PRO": "/images/equipments/101023_Viper_V4_PRO.webp",
  "RealForce R3 TL BT Silent APC": "/images/equipments/102062_RealForce_R3_TL_BT_Silent_APC.webp",
  "Roccat Kone Pure Ultra": "/images/equipments/101032_Kone_Pure_Ultra.webp",
  "Roccat Syn PRO Air": "/images/equipments/103012_Syn_PRO_Air.webp",
  "Roccat Syn Pro Air": "/images/equipments/103013_Cloud_Flight_S.webp",
  "Roccat Vulcan TKL PRO": "/images/equipments/102027_Vulcan_TKL_PRO.webp",
  "Samsung Odyssey OLED G9 G95SC 49 Inch": "/images/equipments/104010_samsung_odyssey_oled_g9_g95sc_49.webp",
  "Secretlab MAGNUS PRO": "/images/equipments/107002_MAGNUS_PRO.webp",
  "Secretlab TITAN Evo": "/images/equipments/106002_TITAN_Evo.webp",
  "Secretlab X T1 Gaming Chair": "/images/equipments/106001_TITAN_Evo_T1_Edition.webp",
  "Sennheiser GAME ONE": "/images/equipments/103019_sennheiser_game_one.webp",
  "Sennheiser GAME ZERO": "/images/equipments/103020_sennheiser_game_zero.webp",
  "Sennheiser GSP 600": "/images/equipments/103021_sennheiser_gsp_600.webp",
  "Shure SE215": "/images/equipments/103022_Shure_SE215.webp",
  "SIDIZ GC PRO": "/images/equipments/106006_sidiz_gc_pro.webp",
  "Sidiz T50": "/images/equipments/106004_T50.webp",
  "SIDIZ T50": "/images/equipments/106004_T50.webp",
  "Sidiz T80": "/images/equipments/106005_T80.webp",
  "SIDIZ T80": "/images/equipments/106005_T80.webp",
  "SPM GM10A": "/images/equipments/101050_SPM_GM10A.webp",
  "SteelSeries Apex Pro Mini": "/images/equipments/102063_SteelSeries_Apex_Pro_Mini.webp",
  "SteelSeries ApeX PRO TKL": "/images/equipments/102025_ApeX_PRO_TKL.webp",
  "SteelSeries ApeX PRO TKL (2023)": "/images/equipments/102025_ApeX_PRO_TKL.webp",
  "SteelSeries Performance Balance": "/images/equipments/105044_SteelSeries_Performance_Balance.webp",
  "SteelSeries QcK": "/images/equipments/105010_QcK_Heavy.webp",
  "SteelSeries QcK Heavy": "/images/equipments/105010_QcK_Heavy.webp",
  "SteelSeries QcK XXL": "/images/equipments/105012_QcK_XXL.webp",
  "Turtle Beach Atlas Air": "/images/equipments/103015_Atlas_Air.webp",
  "Typone MARS PRO": "/images/equipments/102035_MARS_PRO.webp",
  "Ukkz mousepad XL": "/images/equipments/105026_Mousepad_XL.webp",
  "VAXEE PA Black": "/images/equipments/105045_VAXEE_PA_Black.webp",
  "WLMouse Beast MAX": "/images/equipments/101051_WLMouse_Beast_MAX.webp",
  "WLMouse Beast Medium": "/images/equipments/101052_WLMouse_Beast_Medium.webp",
  "WLMouse Beast Mini Pro": "/images/equipments/101053_WLMouse_Beast_Mini_Pro.webp",
  "Wooting 60HE": "/images/equipments/102034_60HE.webp",
  "Wooting 80HE Black": "/images/equipments/102064_wooting_80he_black.webp",
  "X-raypad Aqua Control+": "/images/equipments/105046_X-raypad_Aqua_Control_Plus.webp",
  "X-raypad Aqua Control+ Wave Black": "/images/equipments/105047_X-raypad_Aqua_Control_Plus_Wave_Black.webp",
  "X-raypad Aqua Control+ White": "/images/equipments/105048_X-raypad_Aqua_Control_Plus_White.webp",
  "Xenics StormChaser": "/images/equipments/102033_StormChaser.webp",
  "Xenics StormChaser LT": "/images/equipments/102065_Xenics_StormChaser_LT.webp",
  "Xenics StormX Titan SE": "/images/equipments/102032_StormX_Titan_SE.webp",
  "Xenics TITAN GC wireless": "/images/equipments/101042_TITAN_GC_WIRELESS.webp",
  "Xtrfy M4 RGB": "/images/equipments/101040_M4_RGB.webp",
  "Zaopin Z1 PRO": "/images/equipments/101041_Z1_PRO.webp",
  "Zowie EC2-CW": "/images/equipments/101033_EC2-CW.webp",
  "ZOWIE FK2": "/images/equipments/101054_ZOWIE_FK2.webp",
  "Zowie G-SR II": "/images/equipments/105016_G-SR_II.webp",
  "Zowie G-SR SE": "/images/equipments/105017_G-SR-SE.webp",
  "Zowie Gear Mico": "/images/equipments/101034_Mico.webp",
  "Zowie Gear Mico KT Rolster edition": "/images/equipments/101034_Mico.webp",
  "Zowie P-SR": "/images/equipments/105016_G-SR_II.webp",
  "ZOWIE XL2411P": "/images/equipments/104011_zowie_xl2411p.webp",
  "Zowie XL2540K": "/images/equipments/104001_XL2540K.webp",
  "ZOWIE XL2546": "/images/equipments/104012_zowie_xl2546.webp",
  "ZOWIE XL2546K": "/images/equipments/104013_zowie_xl2546k.webp",
  "ZOWIE XL2546S": "/images/equipments/104014_zowie_xl2546s.webp",
  "Zowie XL2566K": "/images/equipments/104002_XL2566K.webp",
  "ZOWIE XL2566X+": "/images/equipments/104015_zowie_xl2566x.webp",
  "ABKO Hacker K995P V3": "/images/equipments/102067_Abko Hacker K995P V3.webp",
  "Razer DeathAdder V3 Pro Faker Edition": "/images/equipments/101027_DeathAdder_V3_PRO.webp",
  "Razer DeathAdder V3 Pro": "/images/equipments/101027_DeathAdder_V3_PRO.webp",
  "Razer BlackShark V2 Pro Black": "/images/equipments/103006_BlackShark_V2.webp",
  "Razer BlackShark V2 Pro": "/images/equipments/103006_BlackShark_V2.webp",
  "Razer Gigantus V2": "/images/equipments/105005_Gigantus_V2_M.webp",
  "Razer Huntsman V3 Pro Full Size": "/images/equipments/102010_Huntsman_V3_PRO.webp",
  "Razer Huntsman V3 Pro": "/images/equipments/102010_Huntsman_V3_PRO.webp",
  "Secretlab TITAN Evo T1 Edition": "/images/equipments/106001_TITAN_Evo_T1_Edition.webp",
};







;