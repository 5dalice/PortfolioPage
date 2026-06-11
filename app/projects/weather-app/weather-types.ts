export interface GeocodingResult {
  name: string
  country: string
  latitude: number
  longitude: number
}

export interface WeatherData {
  current?: {
    temperature_2m?: number
    apparent_temperature?: number
    relative_humidity_2m?: number
    wind_speed_10m?: number
    precipitation?: number
    pressure_msl?: number
    weather_code?: number
  }
  daily?: {
    time?: string[]
    weather_code?: number[]
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    sunrise?: string[]
    sunset?: string[]
    uv_index_max?: number[]
    precipitation_sum?: number[]
  }
}

export interface CityForecast {
  city: string
  country: string
  time: string[]
  weatherCode: number[]
  maxTemp: number[]
}
