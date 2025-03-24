"use client"

import { useState } from "react"
import { FaSearch, FaPlus } from "react-icons/fa"

// API key - in a real app, this should be an environment variable
// const API_KEY = "4a8c923d1f3d4f91a991e0b4a6e0e8d0"

export default function CitySearch({ addCity }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Handle input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    // Clear any previous errors when user types
    if (error) setError(null)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      setError("Please enter a city name")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // First, get the coordinates for the city
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=1&appid=${process.env.NEXT_PUBLIC_API_KEY}`,
      )

      if (!geoResponse.ok) {
        throw new Error(`Error fetching location: ${geoResponse.statusText}`)
      }

      const geoData = await geoResponse.json()

      if (!geoData || geoData.length === 0) {
        setError("City not found. Please try another name.")
        setIsLoading(false)
        return
      }

      const { lat, lon, name, country, state } = geoData[0]

      // Then, get the weather data using the coordinates
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_API_KEY}&units=metric`,
      )

      if (!weatherResponse.ok) {
        throw new Error(`Error fetching weather: ${weatherResponse.statusText}`)
      }

      const weatherData = await weatherResponse.json()

      // Create the city object with weather data
      const cityWithWeather = {
        name: name,
        country: country || state || "Unknown",
        lat: lat,
        lon: lon,
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

      // Add the city to the list
      addCity(cityWithWeather)

      // Clear the search field
      setSearchTerm("")
    } catch (err) {
      console.error("Error:", err)
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full px-4 py-3 pl-10 rounded-l-lg border border-gray-300 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city name (e.g., London, New York)"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={isLoading}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-lg flex items-center disabled:bg-blue-400"
            disabled={isLoading || !searchTerm.trim()}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <FaPlus className="mr-2" />
            )}
            Add City
          </button>
        </div>

        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

        {isLoading && (
          <div className="mt-2 text-blue-600 text-sm flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            Searching for weather data...
          </div>
        )}
      </form>
    </div>
  )
}

