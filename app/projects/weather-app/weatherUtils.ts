export const majorCities = [
  "Tokyo",
  "Delhi",
  "São Paulo",
  "Mexico City",
  "Cairo",
  "Mumbai",
]

export const getWeatherDescription = (code?: number) => {
  const c = code ?? -1

  if (c === 0) return "Clear sky"
  if ([1, 2, 3].includes(c)) return "Partly cloudy"
  if ([45, 48].includes(c)) return "Fog"
  if ([51, 53, 55, 56, 57].includes(c)) return "Drizzle"
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(c)) return "Rain"
  if ([71, 73, 75, 77, 85, 86].includes(c)) return "Snow"
  if ([95, 96, 99].includes(c)) return "Thunderstorm"

  return "Unknown weather condition"
}

export const getWeatherIcon = (code?: number) => {
  const c = code ?? -1

  if (c === 0) return "☀️"
  if ([1, 2, 3].includes(c)) return "⛅"
  if ([45, 48].includes(c)) return "🌫️"
  if ([51, 53, 55, 56, 57].includes(c)) return "🌦️"
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(c)) return "🌧️"
  if ([71, 73, 75, 77, 85, 86].includes(c)) return "❄️"
  if ([95, 96, 99].includes(c)) return "⛈️"

  return "🌡️"
}

export const formatDate = (date?: string) => {
  if (!date) return "Unknown date"
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export const formatShortDay = (date?: string) => {
  if (!date) return ""
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(date))
}

export const formatTime = (dateTime?: string) => {
  if (!dateTime) return "N/A"
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateTime))
}
