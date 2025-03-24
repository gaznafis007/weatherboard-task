"use client"

import { FaTimes } from "react-icons/fa"
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiHumidity,
  WiWindy,
  WiFog,
  WiDust,
  WiTornado,
} from "react-icons/wi"

export default function WeatherCard({ city, isCelsius, onRemove }) {
  const { name, country, weather } = city

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <WiDaySunny className="text-yellow-500 text-5xl" />
      case "clouds":
        return <WiCloudy className="text-gray-400 text-5xl" />
      case "rain":
      case "drizzle":
        return <WiRain className="text-blue-400 text-5xl" />
      case "thunderstorm":
        return <WiThunderstorm className="text-gray-600 text-5xl" />
      case "snow":
        return <WiSnow className="text-blue-200 text-5xl" />
      case "mist":
      case "fog":
      case "haze":
        return <WiFog className="text-gray-400 text-5xl" />
      case "dust":
      case "sand":
      case "ash":
        return <WiDust className="text-yellow-700 text-5xl" />
      case "tornado":
        return <WiTornado className="text-gray-700 text-5xl" />
      default:
        return <WiDaySunny className="text-yellow-500 text-5xl" />
    }
  }

  const getBackgroundColor = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "bg-gradient-to-br from-yellow-100 to-yellow-200"
      case "clouds":
        return "bg-gradient-to-br from-blue-50 to-gray-100"
      case "rain":
      case "drizzle":
        return "bg-gradient-to-br from-blue-100 to-blue-200"
      case "thunderstorm":
        return "bg-gradient-to-br from-gray-300 to-gray-400"
      case "snow":
        return "bg-gradient-to-br from-blue-50 to-gray-100"
      case "mist":
      case "fog":
      case "haze":
        return "bg-gradient-to-br from-gray-200 to-gray-300"
      case "dust":
      case "sand":
      case "ash":
        return "bg-gradient-to-br from-yellow-100 to-yellow-200"
      default:
        return "bg-gradient-to-br from-blue-50 to-blue-100"
    }
  }

  const temperature = isCelsius ? `${weather.temperature.celsius}°C` : `${weather.temperature.fahrenheit}°F`

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${getBackgroundColor(weather.condition)}`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <p className="text-sm text-gray-600">{country}</p>
          </div>
          <button
            onClick={() => onRemove(name)}
            className="text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Remove city"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            {weather.icon ? (
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description || weather.condition}
                width={50}
                height={50}
              />
            ) : (
              getWeatherIcon(weather.condition)
            )}
            <span className="ml-2 text-gray-700 capitalize">{weather.description || weather.condition}</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{temperature}</div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <WiHumidity className="text-blue-500 text-2xl mr-2" />
            <div>
              <p className="text-xs text-gray-500">Humidity</p>
              <p className="text-gray-700 font-medium">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center">
            <WiWindy className="text-blue-500 text-2xl mr-2" />
            <div>
              <p className="text-xs text-gray-500">Wind Speed</p>
              <p className="text-gray-700 font-medium">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

