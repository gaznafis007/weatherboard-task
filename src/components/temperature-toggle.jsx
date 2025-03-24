"use client"

import { FaThermometerHalf } from "react-icons/fa"

export default function TemperatureToggle({ isCelsius, toggleTemperature }) {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm font-medium text-gray-700">°F</span>
      <button
        onClick={toggleTemperature}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isCelsius ? "bg-blue-600" : "bg-gray-200"}`}
        aria-pressed={isCelsius}
      >
        <span className="sr-only">{isCelsius ? "Use Fahrenheit" : "Use Celsius"}</span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isCelsius ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
      <span className="ml-2 text-sm font-medium text-gray-700">°C</span>
      <FaThermometerHalf className="ml-2 text-gray-600" />
    </div>
  )
}

