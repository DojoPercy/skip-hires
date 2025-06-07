import { NextResponse } from "next/server"

// This is a server-side proxy to avoid CORS issues when fetching from the client
export async function GET() {
  try {
    const response = await fetch("https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft", {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching skip data:", error)
    return NextResponse.json({ error: "Failed to fetch skip data" }, { status: 500 })
  }
}
