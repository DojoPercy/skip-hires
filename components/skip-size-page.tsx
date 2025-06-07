"use client"

import { useState, useEffect } from "react"
import SkipCard from "./skip-card"
import FilterBar from "./filter-bar"
import SkipHeader from "./skip-header"
import LoadingState from "./loading-state"
import ErrorState from "./error-state"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface Skip {
  id: number
  size: number
  hire_period_days: number
  price_before_vat: number
  vat: number
  allowed_on_road: boolean
  allows_heavy_waste: boolean
  forbidden: boolean
}

export default function SkipSizePage() {
  const [skips, setSkips] = useState<Skip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null)
  const [filterRoadOnly, setFilterRoadOnly] = useState(false)
  const [filterHeavyWaste, setFilterHeavyWaste] = useState(false)

  useEffect(() => {
    const fetchSkips = async () => {
      try {
        setLoading(true)
        // In a real app, we would use the actual API endpoint
        // const response = await fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft');

        // For this demo, we'll simulate the API response with a timeout
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data based on the API structure
        const mockData = [
          {
            id: 17933,
            size: 4,
            hire_period_days: 14,
            price_before_vat: 278,
            vat: 20,
            allowed_on_road: true,
            allows_heavy_waste: true,
            forbidden: false,
          },
          {
            id: 17934,
            size: 6,
            hire_period_days: 14,
            price_before_vat: 305,
            vat: 20,
            allowed_on_road: true,
            allows_heavy_waste: true,
            forbidden: false,
          },
          {
            id: 17935,
            size: 8,
            hire_period_days: 14,
            price_before_vat: 375,
            vat: 20,
            allowed_on_road: true,
            allows_heavy_waste: true,
            forbidden: false,
          },
          {
            id: 17936,
            size: 10,
            hire_period_days: 14,
            price_before_vat: 400,
            vat: 20,
            allowed_on_road: false,
            allows_heavy_waste: false,
            forbidden: false,
          },
          {
            id: 17937,
            size: 12,
            hire_period_days: 14,
            price_before_vat: 439,
            vat: 20,
            allowed_on_road: false,
            allows_heavy_waste: false,
            forbidden: false,
          },
          {
            id: 17938,
            size: 14,
            hire_period_days: 14,
            price_before_vat: 470,
            vat: 20,
            allowed_on_road: false,
            allows_heavy_waste: false,
            forbidden: false,
          },
          {
            id: 17939,
            size: 16,
            hire_period_days: 14,
            price_before_vat: 496,
            vat: 20,
            allowed_on_road: false,
            allows_heavy_waste: false,
            forbidden: false,
          },
          {
            id: 15124,
            size: 20,
            hire_period_days: 14,
            price_before_vat: 992,
            vat: 20,
            allowed_on_road: false,
            allows_heavy_waste: true,
            forbidden: false,
          },
          {
            id: 15125,
            size: 40,
            hire_period_days: 14,
            price_before_vat: 992,
            vat: 20,
            allowed_on_road: false,
            allows_heavy_waste: false,
            forbidden: false,
          },
        ]

        setSkips(mockData)
        setError(null)
      } catch (err) {
        console.error("Error fetching skips:", err)
        setError("Failed to load skip data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSkips()
  }, [])

  const handleSelectSkip = (skip: Skip) => {
    setSelectedSkip(skip)

    toast({
      title: "Skip Selected",
      description: `You've selected a ${skip.size} yard skip.`,
      action: <ToastAction altText="Continue to checkout">Continue</ToastAction>,
    })
  }

  const handleFilterChange = (filterType: string, value: boolean) => {
    if (filterType === "road") {
      setFilterRoadOnly(value)
    } else if (filterType === "heavy") {
      setFilterHeavyWaste(value)
    }
  }

  const filteredSkips = skips.filter((skip) => {
    if (filterRoadOnly && !skip.allowed_on_road) return false
    if (filterHeavyWaste && !skip.allows_heavy_waste) return false
    return true
  })

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <SkipHeader />

        <FilterBar
          filterRoadOnly={filterRoadOnly}
          filterHeavyWaste={filterHeavyWaste}
          onFilterChange={handleFilterChange}
          totalSkips={skips.length}
          filteredSkips={filteredSkips.length}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredSkips.map((skip) => (
            <SkipCard
              key={skip.id}
              skip={skip}
              isSelected={selectedSkip?.id === skip.id}
              onSelect={() => handleSelectSkip(skip)}
            />
          ))}
        </div>

        {filteredSkips.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No skips match your filters</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filter criteria</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => {
                setFilterRoadOnly(false)
                setFilterHeavyWaste(false)
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
