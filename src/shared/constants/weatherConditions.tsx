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

export const WEATHER_CONDITIONS: Record<
  string,
  { icon: React.ReactNode; label: string }
> = {
  "01": {
    icon: <Sun className="w-8 h-8 text-yellow-500" />,
    label: "맑음",
  },
  "02": {
    icon: <CloudSun className="w-8 h-8 text-blue-400" />,
    label: "구름 조금",
  },
  "03": {
    icon: <Cloud className="w-8 h-8 text-gray-400" />,
    label: "흐림",
  },
  "04": {
    icon: <Cloud className="w-8 h-8 text-gray-500" />,
    label: "매우 흐림",
  },
  "09": {
    icon: <CloudDrizzle className="w-8 h-8 text-blue-400" />,
    label: "소나기",
  },
  "10": {
    icon: <CloudRain className="w-8 h-8 text-blue-600" />,
    label: "비",
  },
  "11": {
    icon: <CloudLightning className="w-8 h-8 text-purple-500" />,
    label: "뇌우",
  },
  "13": {
    icon: <CloudSnow className="w-8 h-8 text-blue-100" />,
    label: "눈",
  },
  "50": {
    icon: <CloudFog className="w-8 h-8 text-slate-400" />,
    label: "안개",
  },
};
