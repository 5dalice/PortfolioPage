"use client"

import { useEffect, useState } from "react"
import { SearchHeader } from "@/components/search-header"
import { SearchFooter } from "@/components/search-footer"

interface GeocodingResult {
  name: string
  country: string
  latitude: number
  longitude: number
}

interface WeatherData {
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

interface CityForecast {
  city: string
  country: string
  time: string[]
  weatherCode: number[]
  maxTemp: number[]
}

const majorCities = [
  "Tokyo",
  "Delhi",
  "São Paulo",
  "Mexico City",
  "Cairo",
  "Mumbai",
]

export default function WeatherAppPage() {
  const [city, setCity] = useState("")
  const [location, setLocation] = useState<GeocodingResult | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [cityForecasts, setCityForecasts] = useState<CityForecast[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingCities, setLoadingCities] = useState(true)

  const getWeatherDescription = (code?: number) => {
    if (code === 0) return "Clear sky"
    if (code && [1, 2, 3].includes(code)) return "Partly cloudy"
    if (code && [45, 48].includes(code)) return "Fog"
    if (code && [51, 53, 55, 56, 57].includes(code)) return "Drizzle"
    if (code && [61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain"
    if (code && [71, 73, 75, 77, 85, 86].includes(code)) return "Snow"
    if (code && [95, 96, 99].includes(code)) return "Thunderstorm"
    return "Unknown weather condition"
  }

  const getWeatherIcon = (code?: number) => {
    if (code === 0) return "☀️"
    if (code && [1, 2, 3].includes(code)) return "⛅"
    if (code && [45, 48].includes(code)) return "🌫️"
    if (code && [51, 53, 55, 56, 57].includes(code)) return "🌦️"
    if (code && [61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️"
    if (code && [71, 73, 75, 77, 85, 86].includes(code)) return "❄️"
    if (code && [95, 96, 99].includes(code)) return "⛈️"
    return "🌡️"
  }

  const formatDate = (date?: string) => {
    if (!date) return "Unknown date"

    return new Intl.DateTimeFormat("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  const formatShortDay = (date?: string) => {
    if (!date) return ""

    return new Intl.DateTimeFormat("en", {
      weekday: "short",
    }).format(new Date(date))
  }

  const formatTime = (dateTime?: string) => {
    if (!dateTime) return "N/A"

    return new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateTime))
  }

  const loadMajorCities = async () => {
    setLoadingCities(true)

    try {
      const results = await Promise.all(
        majorCities.map(async (cityName) => {
          const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              cityName,
            )}&count=1&language=en&format=json`,
          )

          if (!geoResponse.ok) return null

          const geoData = await geoResponse.json()
          const place = geoData.results?.[0]

          if (!place) return null

          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=weather_code,temperature_2m_max&forecast_days=4&timezone=auto`,
          )

          if (!weatherResponse.ok) return null

          const weatherData = await weatherResponse.json()

          if (!weatherData.daily?.time) return null

          return {
            city: cityName,
            country: place.country,
            time: weatherData.daily.time,
            weatherCode: weatherData.daily.weather_code,
            maxTemp: weatherData.daily.temperature_2m_max,
          }
        }),
      )

      setCityForecasts(results.filter(Boolean) as CityForecast[])
    } catch {
      setCityForecasts([])
    } finally {
      setLoadingCities(false)
    }
  }

  useEffect(() => {
    loadMajorCities()
  }, [])

  const handleSearch = async (selectedCity?: string) => {
    setError("")
    setWeather(null)
    setLocation(null)

    const trimmedCity = (selectedCity ?? city).trim()

    if (!trimmedCity) {
      setError("Please enter a city.")
      return
    }

    if (trimmedCity.length > 80) {
      setError("The city name is too long. Please enter a shorter search term.")
      return
    }

    setLoading(true)

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          trimmedCity,
        )}&count=1&language=en&format=json`,
      )

      if (!geoResponse.ok) {
        setError("The location service is currently unavailable.")
        return
      }

      const geoData = await geoResponse.json()

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found. Please check the spelling and try again.")
        return
      }

      const foundLocation = geoData.results[0]
      setLocation(foundLocation)

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${foundLocation.latitude}&longitude=${foundLocation.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,pressure_msl,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=auto`,
      )

      if (!weatherResponse.ok) {
        setError("The weather service is currently unavailable.")
        return
      }

      const weatherData = await weatherResponse.json()

      if (!weatherData.current) {
        setError("Weather data is incomplete. Please try another city.")
        return
      }

      setWeather(weatherData)
    } catch {
      setError("Could not fetch weather data. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <SearchHeader query="weather app" />

      <main className="flex-1 py-8">
        <section className="px-4 md:pl-[180px] md:pr-6">
          <article className="max-w-[600px] mb-6">
            <cite className="text-[14px] text-[#006621] not-italic block mb-1">
              aliceewaldsen.dev/projects/weather-app
            </cite>

            <h1 className="text-[18px] leading-tight mb-1 text-[#1a0dab] font-normal">
              Weather App - Real-Time Weather Dashboard
            </h1>

            <p className="text-[13px] text-[#545454] leading-[1.4]">
              A weather application that fetches real-time weather data from a
              free public API. The project includes city-based search, current
              conditions, 7-day forecast, UV index, precipitation, sunrise,
              sunset, and responsive UI built with React, TypeScript, and
              Next.js.
            </p>
          </article>

          <article className="max-w-[600px] mb-6">
            <cite className="text-[14px] text-[#006621] not-italic block mb-1">
              open-meteo.com
            </cite>

            <h2 className="text-[18px] leading-tight mb-1 text-[#1a0dab] font-normal">
              Search weather by city
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 mt-3 mb-4">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch()
                }}
                placeholder="Enter city, e.g. Gothenburg"
                maxLength={80}
                className="flex-1 bg-white text-black border-2 border-[#c0c0c0] px-3 py-2 text-[14px] focus:outline-none focus:border-[#4285f4]"
              />

              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-4 py-2 text-[13px] text-black bg-[#f2f2f2] border border-[#f2f2f2] hover:border-[#c6c6c6] hover:shadow-sm active:border-[#666] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Searching..." : "Weather Search"}
              </button>
            </div>

            {loading && (
              <p className="text-[13px] text-[#545454]">
                Loading weather data...
              </p>
            )}

            {error && <p className="text-[13px] text-[#d93025]">{error}</p>}
          </article>

          {!weather && (
            <article className="max-w-[1100px] mb-6">
              <cite className="text-[14px] text-[#006621] not-italic block mb-1">
                api.open-meteo.com/major-world-cities
              </cite>

              <h2 className="text-[18px] leading-tight mb-1 text-[#1a0dab] font-normal">
                Major World Cities
              </h2>

              <p className="text-[13px] text-[#545454] leading-[1.4]">
                Select a city to view detailed real-time weather and a 7-day
                forecast.
              </p>

              {loadingCities ? (
                <p className="text-[13px] text-[#545454] mt-3">
                  Loading city forecasts...
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-8 sm:grid-cols-3 lg:grid-cols-6">
                  {cityForecasts.map((item) => {
                    const currentCode = item.weatherCode[0]
                    const currentTemp = Math.round(item.maxTemp[0])

                    return (
                      <button
                        key={item.city}
                        type="button"
                        onClick={() => {
                          setCity(item.city)
                          handleSearch(item.city)
                        }}
                        className="group w-full min-w-0 text-left border border-[#dadce0] bg-[#fafafa] hover:bg-[#f8f9fa] hover:border-[#c6c6c6] hover:shadow-sm transition-all"
                      >
                        <div
                          className="p-3 sm:p-4 border-b border-[#ebebeb]"
                          style={{
                            background:
                              "linear-gradient(to bottom, #f5f5f5 0%, #f1f1f1 100%)",
                          }}
                        >
                          <p className="truncate text-[14px] font-bold text-black">
                            {item.city}
                          </p>
                          <p className="truncate text-[12px] text-[#70757a] mt-0.5">
                            {item.country}
                          </p>

                          <p className="mt-4 text-[24px] sm:text-[28px] leading-none text-[#d93025]">
                            {Number.isFinite(currentTemp)
                              ? `${currentTemp}°`
                              : "N/A"}
                          </p>

                          <p className="mt-2 truncate text-[12px] text-[#545454]">
                            {getWeatherIcon(currentCode)}{" "}
                            {getWeatherDescription(currentCode)}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 text-center bg-white">
                          {item.time.slice(1, 4).map((day, index) => {
                            const forecastIndex = index + 1

                            return (
                              <div
                                key={day}
                                className="px-1.5 py-3 border-r border-[#ebebeb] last:border-r-0"
                              >
                                <p className="text-[11px] text-[#70757a] mb-1">
                                  {formatShortDay(day)}
                                </p>
                                <p className="text-[17px] leading-none">
                                  {getWeatherIcon(
                                    item.weatherCode[forecastIndex],
                                  )}
                                </p>
                                <p className="text-[11px] text-[#d93025] mt-1">
                                  {Math.round(item.maxTemp[forecastIndex])}°
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </article>
          )}

          {weather?.daily?.time && location && (
            <article className="max-w-[1100px] mb-6">
              <cite className="text-[14px] text-[#006621] not-italic block mb-1">
                api.open-meteo.com/weather/{location.name.toLowerCase()}
              </cite>

              <h2 className="text-[18px] leading-tight mb-1 text-[#1a0dab] font-normal">
                7-Day Forecast for {location.name}, {location.country}
              </h2>

              <p className="text-[13px] text-[#545454] leading-[1.4]">
                Current conditions and daily forecast displayed as weather cards.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-8 sm:grid-cols-3 xl:grid-cols-7">
                {weather.daily.time.map((day, index) => (
                  <article
                    key={day}
                    className="w-full min-w-0 text-left border border-[#dadce0] bg-[#fafafa]"
                  >
                    <div
                      className="p-3 sm:p-4 border-b border-[#ebebeb]"
                      style={{
                        background:
                          "linear-gradient(to bottom, #f5f5f5 0%, #f1f1f1 100%)",
                      }}
                    >
                      <p className="truncate text-[13px] font-bold text-black">
                        {formatDate(day)}
                      </p>

                      <p className="mt-4 text-[24px] sm:text-[28px] leading-none text-[#d93025]">
                        {weather.daily?.temperature_2m_max?.[index] ?? "N/A"}°
                      </p>

                      <p className="mt-2 truncate text-[12px] text-[#545454]">
                        {getWeatherIcon(weather.daily?.weather_code?.[index])}{" "}
                        {getWeatherDescription(
                          weather.daily?.weather_code?.[index],
                        )}
                      </p>
                    </div>

                    <div className="p-3 text-[11px] sm:text-[12px] text-[#545454] leading-[1.6] bg-white">
                      <p>
                        <strong className="text-black">Min:</strong>{" "}
                        {weather.daily?.temperature_2m_min?.[index] ?? "N/A"}°C
                      </p>
                      <p>
                        <strong className="text-black">UV:</strong>{" "}
                        {weather.daily?.uv_index_max?.[index] ?? "N/A"}
                      </p>
                      <p>
                        <strong className="text-black">Rain:</strong>{" "}
                        {weather.daily?.precipitation_sum?.[index] ?? "N/A"} mm
                      </p>
                      <p className="truncate">
                        <strong className="text-black">Sunrise:</strong>{" "}
                        {formatTime(weather.daily?.sunrise?.[index])}
                      </p>
                      <p className="truncate">
                        <strong className="text-black">Sunset:</strong>{" "}
                        {formatTime(weather.daily?.sunset?.[index])}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          )}
        </section>
      </main>

      <SearchFooter query="weather app" />
    </div>
  )
}