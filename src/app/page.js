"use client"

import { useState, useEffect } from "react"
import CitySearch from "@/components/city-search"
import WeatherCard from "@/components/weather-card"
import TemperatureToggle from "@/components/temperature-toggle"
import { WiDaySunny } from "react-icons/wi"

// API key - in a real app, this should be an environment variable
// const API_KEY = "4a8c923d1f3d4f91a991e0b4a6e0e8d0"

export default function Home() {
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCelsius, setIsCelsius] = useState(true)
  const [error, setError] = useState(null)

  // Load cities from localStorage on initial render
  useEffect(() => {
    try {
      const savedCities = localStorage.getItem("weatherCities")
      if (savedCities) {
        const parsedCities = JSON.parse(savedCities)
        setCities(parsedCities)

        // Refresh weather data for all saved cities
        parsedCities.forEach((city) => {
          refreshWeatherData(city)
        })
      }
    } catch (err) {
      console.error("Error loading saved cities:", err)
      setError("Failed to load saved cities")
    }
  }, [])

  // Save cities to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("weatherCities", JSON.stringify(cities))
    } catch (err) {
      console.error("Error saving cities:", err)
    }
  }, [cities])

  const refreshWeatherData = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${process.env.NEXT_PUBLIC_API_KEY}&units=metric`,
      )

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`)
      }

      const weatherData = await response.json()

      const updatedCity = {
        ...city,
        weather: {
          condition: weatherData.weather[0].main,
          description: weatherData.weather[0].description,
          temperature: {
            celsius: Math.round(weatherData.main.temp),
            fahrenheit: Math.round((weatherData.main.temp * 9) / 5 + 32),
          },
          humidity: weatherData.main.humidity,
          windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
          icon: weatherData.weather[0].icon,
        },
      }

      setCities((prevCities) => prevCities.map((c) => (c.name === city.name ? updatedCity : c)))
    } catch (error) {
      console.error("Error refreshing weather data:", error)
    }
  }

  const addCity = (city) => {
    // Check if city already exists
    if (!cities.some((c) => c.name === city.name)) {
      setCities((prevCities) => [...prevCities, city])
    } else {
      // Update existing city with new weather data
      setCities((prevCities) => prevCities.map((c) => (c.name === city.name ? city : c)))
    }
  }

  const removeCity = (cityName) => {
    setCities(cities.filter((city) => city.name !== cityName))
  }

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius)
  }

  // Refresh all weather data every 10 minutes
  useEffect(() => {
    const refreshAllWeather = () => {
      cities.forEach((city) => {
        refreshWeatherData(city)
      })
    }

    const intervalId = setInterval(refreshAllWeather, 10 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [cities])

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 flex items-center">
              <WiDaySunny className="text-yellow-500 mr-2 text-4xl md:text-5xl" />
              Weather Dashboard
            </h1>
            <TemperatureToggle isCelsius={isCelsius} toggleTemperature={toggleTemperature} />
          </div>
          <p className="text-blue-600 mt-2">Check weather conditions for multiple cities</p>
        </header>

        <div className="mb-8">
          <CitySearch addCity={addCity} />
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {isLoading && cities.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <WeatherCard
                key={`${city.name}-${city.lat}-${city.lon}`}
                city={city}
                isCelsius={isCelsius}
                onRemove={removeCity}
              />
            ))}

            {cities.length === 0 && (
              <div className="col-span-full text-center p-12 bg-white/80 rounded-lg shadow">
                <p className="text-gray-500 text-lg">
                  No cities added yet. Enter a city name above and click &quote;Add City&quote;.
                </p>
                <p className="text-gray-400 text-sm mt-2">Try cities like: London, New York, Tokyo, Paris, Sydney</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

