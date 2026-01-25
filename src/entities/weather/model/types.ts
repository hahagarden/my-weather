interface WeatherMain {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface WeatherCommon {
    dt: number;
    localTime: Date;
    sunrise?: number;
    sunset?: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: WeatherMain[];
}

export interface WeatherDaily {
    dt: number;
    localTime: Date;
    sunrise?: number;
    sunset?: number;
    temp: {
        max: number;
        min: number;
    };
    feels_like: {
        day: number;
        night: number;
        eve: number;
        morn: number;
    };
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    weather: WeatherMain[];
}

export interface Weather {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: WeatherCommon;
    hourly: WeatherCommon[];
    daily: WeatherDaily[];
};