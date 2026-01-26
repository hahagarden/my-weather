import { Sun, CloudSun, Cloud, CloudDrizzle, CloudRain, CloudLightning, CloudSnow, CloudFog } from 'lucide-react';

export const WEATHER_CONDITIONS: Record<string, { icon: React.ReactNode; label: string; image: string }> = {
    '01': {
      icon: <Sun className="w-8 h-8 text-yellow-500" />,
      label: '맑음',
      image: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=800&auto=format&fit=crop'
    },
    '02': {
      icon: <CloudSun className="w-8 h-8 text-blue-400" />,
      label: '구름 조금',
      image: 'https://images.unsplash.com/photo-1500491460312-750eb0302121?q=80&w=800&auto=format&fit=crop'
    },
    '03': {
      icon: <Cloud className="w-8 h-8 text-gray-400" />,
      label: '흐림',
      image: 'https://images.unsplash.com/photo-1534088568595-a066f7104211?q=80&w=800&auto=format&fit=crop'
    },
    '04': {
      icon: <Cloud className="w-8 h-8 text-gray-500" />,
      label: '매우 흐림',
      image: 'https://images.unsplash.com/photo-1483977399921-6cf94f6fdc3a?q=80&w=800&auto=format&fit=crop'
    },
    '09': {
      icon: <CloudDrizzle className="w-8 h-8 text-blue-400" />,
      label: '소나기',
      image: 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?q=80&w=800&auto=format&fit=crop'
    },
    '10': {
      icon: <CloudRain className="w-8 h-8 text-blue-600" />,
      label: '비',
      image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a53c17?q=80&w=800&auto=format&fit=crop'
    },
    '11': {
      icon: <CloudLightning className="w-8 h-8 text-purple-500" />,
      label: '뇌우',
      image: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=800&auto=format&fit=crop'
    },
    '13': {
      icon: <CloudSnow className="w-8 h-8 text-blue-100" />,
      label: '눈',
      image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=800&auto=format&fit=crop'
    },
    '50': {
      icon: <CloudFog className="w-8 h-8 text-slate-400" />,
      label: '안개',
      image: 'https://images.unsplash.com/photo-1543968996-ee822b8176ba?q=80&w=800&auto=format&fit=crop'
    }
  };