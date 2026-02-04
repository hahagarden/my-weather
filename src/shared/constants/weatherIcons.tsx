import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";

export const WEATHER_ICONS: Record<
  string,
  { icon: React.ReactNode; label: string }
> = {
  "01": {
    icon: <Sun className="w-8 h-8 text-yellow-500" aria-label="맑음" />,
    label: "맑음",
  },
  "02": {
    icon: <CloudSun className="w-8 h-8 text-blue-400" aria-label="구름 조금" />,
    label: "구름 조금",
  },
  "03": {
    icon: <Cloud className="w-8 h-8 text-gray-400" aria-label="흐림" />,
    label: "흐림",
  },
  "04": {
    icon: <Cloud className="w-8 h-8 text-gray-500" aria-label="매우 흐림" />,
    label: "매우 흐림",
  },
  "09": {
    icon: (
      <CloudDrizzle className="w-8 h-8 text-blue-400" aria-label="소나기" />
    ),
    label: "소나기",
  },
  "10": {
    icon: <CloudRain className="w-8 h-8 text-blue-600" aria-label="비" />,
    label: "비",
  },
  "11": {
    icon: (
      <CloudLightning className="w-8 h-8 text-purple-500" aria-label="뇌우" />
    ),
    label: "뇌우",
  },
  "13": {
    icon: <CloudSnow className="w-8 h-8 text-blue-100" aria-label="눈" />,
    label: "눈",
  },
  "50": {
    icon: <CloudFog className="w-8 h-8 text-slate-400" aria-label="안개" />,
    label: "안개",
  },
};
