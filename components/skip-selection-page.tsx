"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import SkipCard from "./skip-card"
import FilterPanel from "./filter-panel"
import LoadingSpinner from "./loading-spinner"
import ErrorMessage from "./error-message"
import SelectedSkipSummary from "./selected-skip-summary"
import { toast } from "sonner"
import ProgressHeader from "./progress-header"
import PageHeader from "./page"

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

export default function SkipSelectionPage() {
  const [skips, setSkips] = useState<Skip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null)
  const [filters, setFilters] = useState({
    roadOnly: false,
    heavyWaste: false,
    priceRange: [0, 1500] as [number, number],
    sizeRange: [4, 40] as [number, number],
  })

  useEffect(() => {
    const fetchSkips = async () => {
      try {
        setLoading(true)

        // Fetch data from the real API endpoint
        const response = await fetch("https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft")

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()

        // Check if the data has the expected structure
        if (!Array.isArray(data)) {
          throw new Error("API response is not in the expected format")
        }

        // Set the price and size range based on the actual data
        if (data.length > 0) {
          const prices = data.map((skip) => Math.round(skip.price_before_vat * (1 + skip.vat / 100)))
          const sizes = data.map((skip) => skip.size)

          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          const minSize = Math.min(...sizes)
          const maxSize = Math.max(...sizes)

          setFilters((prev) => ({
            ...prev,
            priceRange: [minPrice, maxPrice],
            sizeRange: [minSize, maxSize],
          }))
        }

        setSkips(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching skips:", err)
        setError("Unable to load skip options. Please try again.")

        // Fallback to mock data in case the API fails
        const mockData: Skip[] = [
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
      } finally {
        setLoading(false)
      }
    }

    fetchSkips()
  }, [])

  const handleSelectSkip = (skip: Skip) => {
    setSelectedSkip(skip)
    toast.success(`${skip.size} Yard Skip selected!`, {
      description: `£${Math.round(skip.price_before_vat * (1 + skip.vat / 100))} including VAT`,
      action: {
        label: "Continue",
        onClick: () => console.log("Continue to checkout"),
      },
    })
  }

  const calculatePrice = (skip: Skip) => {
    return Math.round(skip.price_before_vat * (1 + skip.vat / 100))
  }

  const filteredSkips = skips.filter((skip) => {
    const price = calculatePrice(skip)

    if (filters.roadOnly && !skip.allowed_on_road) return false
    if (filters.heavyWaste && !skip.allows_heavy_waste) return false
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
    if (skip.size < filters.sizeRange[0] || skip.size > filters.sizeRange[1]) return false

    return true
  })

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Progress Header */}
      <ProgressHeader />

      {/* Page Header */}
      <PageHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel - Sidebar on desktop, top on mobile */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              totalSkips={skips.length}
              filteredCount={filteredSkips.length}
            />
          </div>

          {/* Skip Cards Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Available Skips</h2>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {filteredSkips.length} of {skips.length} skips
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredSkips.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a7.966 7.966 0 00-6 0m6 0V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v3.5m6 0V12a8 8 0 11-16 0V6.5"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No skips match your criteria
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Try adjusting your filters to see more options
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        roadOnly: false,
                        heavyWaste: false,
                        priceRange: [0, 1500],
                        sizeRange: [4, 40],
                      })
                    }
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredSkips.map((skip, index) => (
                    <motion.div
                      key={skip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SkipCard
                        skip={skip}
                        isSelected={selectedSkip?.id === skip.id}
                        onSelect={() => handleSelectSkip(skip)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Selected Skip Summary - Sticky bottom on mobile */}
      <AnimatePresence>
        {selectedSkip && (
          <SelectedSkipSummary
            skip={selectedSkip}
            onContinue={() => console.log("Continue to checkout")}
            onDeselect={() => setSelectedSkip(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
