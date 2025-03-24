import "./globals.css"

export const metadata = {
  title: "WeatherBoard",
  description: "Check weather conditions for multiple cities",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}

