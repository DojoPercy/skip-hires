"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  MapPin,
  Trash2,
  Truck,
  Shield,
  Calendar,
  CreditCard,
  ArrowRight,
  AlertTriangle,
  Check,
  Info,
  Weight,
  Clock,
  Star,
  ChevronDown,
  Filter,
  DollarSign,
  Ruler,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const steps = [
  { id: "postcode", label: "Postcode", icon: MapPin, active: true, completed: true },
  { id: "waste-type", label: "Waste Type", icon: Trash2, active: true, completed: true },
  { id: "select-skip", label: "Select Skip", icon: Truck, active: true, completed: false },
  { id: "permit-check", label: "Permit Check", icon: Shield, active: false, completed: false },
  { id: "choose-date", label: "Choose Date", icon: Calendar, active: false, completed: false },
  { id: "payment", label: "Payment", icon: CreditCard, active: false, completed: false },
]

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

const skipRecommendations = {
  4: "Perfect for small bathroom renovations or garden clearance",
  6: "Ideal for kitchen renovations or small house clearouts",
  8: "Great for medium home renovations or garage clearance",
  10: "Perfect for large home renovations or small construction projects",
  12: "Ideal for major home renovations or medium construction work",
  14: "Great for large construction projects or major clearouts",
  16: "Perfect for commercial projects or large construction work",
  20: "Ideal for major construction or commercial projects",
  40: "Perfect for large-scale commercial or industrial projects",
}

// Waste volume examples for the slider
const wasteExamples = [
  { volume: 4, example: "Small bathroom renovation" },
  { volume: 6, example: "Kitchen renovation" },
  { volume: 8, example: "Garage clearance" },
  { volume: 12, example: "Home renovation" },
  { volume: 16, example: "Large construction" },
  { volume: 20, example: "Commercial project" },
  { volume: 40, example: "Industrial project" },
]

export default function SkipHireRedesign() {
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null)
  const [skips, setSkips] = useState<Skip[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filterRoadOnly, setFilterRoadOnly] = useState(false)
  const [filterHeavyWaste, setFilterHeavyWaste] = useState(false)

  // Mobile slider states
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Slider states
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 40])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1200])
  const [wasteVolume, setWasteVolume] = useState<number>(8)

  // Refs for slider tooltips
  const sizeSliderRef = useRef<HTMLDivElement>(null)
  const priceSliderRef = useRef<HTMLDivElement>(null)
  const volumeSliderRef = useRef<HTMLDivElement>(null)

  // Mock data based on the provided API response
  useEffect(() => {
    const mockSkips: Skip[] = [
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

    setTimeout(() => {
      setSkips(mockSkips)

      // Set initial price range based on data
      const prices = mockSkips.map((skip) => calculatePrice(skip))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      setPriceRange([minPrice, maxPrice])

      // Set initial size range based on data
      const sizes = mockSkips.map((skip) => skip.size)
      const minSize = Math.min(...sizes)
      const maxSize = Math.max(...sizes)
      setSizeRange([minSize, maxSize])

      setLoading(false)
    }, 800)
  }, [])

  const calculatePrice = (skip: Skip) => {
    const totalPrice = skip.price_before_vat * (1 + skip.vat / 100)
    return Math.round(totalPrice)
  }

  const filteredSkips = skips.filter((skip) => {
    const price = calculatePrice(skip)

    // Apply all filters
    if (filterRoadOnly && !skip.allowed_on_road) return false
    if (filterHeavyWaste && !skip.allows_heavy_waste) return false
    if (skip.size < sizeRange[0] || skip.size > sizeRange[1]) return false
    if (price < priceRange[0] || price > priceRange[1]) return false

    return true
  })

  // Sort skips by how close they are to the selected waste volume
  const sortedSkips = [...filteredSkips].sort((a, b) => {
    const aDiff = Math.abs(a.size - wasteVolume)
    const bDiff = Math.abs(b.size - wasteVolume)
    return aDiff - bDiff
  })

  const handleSkipSelect = (skip: Skip) => {
    setSelectedSkip(skip)
  }

  const handleContinue = () => {
    if (selectedSkip) {
      console.log("Continuing with skip:", selectedSkip)
    }
  }

  const handleBack = () => {
    console.log("Going back")
  }

  // Mobile slider functions
  const nextSlide = useCallback(() => {
    if (currentSlide < sortedSkips.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }, [currentSlide, sortedSkips.length])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }, [currentSlide])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  // Touch/drag handlers for mobile slider
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0))
    setScrollLeft(sliderRef.current?.scrollLeft || 0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0))
    setScrollLeft(sliderRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Find the closest waste example to the current slider value
  const closestWasteExample = wasteExamples.reduce((prev, curr) => {
    return Math.abs(curr.volume - wasteVolume) < Math.abs(prev.volume - wasteVolume) ? curr : prev
  }, wasteExamples[0])

  // Handle size range slider change
  const handleSizeRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number.parseInt(e.target.value)
    setSizeRange((prev) => {
      const newRange = [...prev] as [number, number]
      newRange[index] = value
      return newRange
    })
  }

  // Handle price range slider change
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number.parseInt(e.target.value)
    setPriceRange((prev) => {
      const newRange = [...prev] as [number, number]
      newRange[index] = value
      return newRange
    })
  }

  // Handle waste volume slider change
  const handleWasteVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWasteVolume(Number.parseInt(e.target.value))
  }

  // Calculate the percentage position for slider thumbs
  const calculateThumbPosition = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#2A2A2A] border-t-[#0037C1] rounded-full animate-spin mx-auto mb-4"></div>
            <Truck className="w-6 h-6 text-[#0037C1] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white font-medium">Finding the perfect skips for you...</p>
          <p className="text-sm text-gray-400 mt-1">This won't take long</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Enhanced Header */}
      <div className="bg-[#1C1C1C] border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="py-6">
            <div className="flex items-center justify-center overflow-x-auto">
              <div className="flex items-center space-x-1 sm:space-x-4">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isLast = index === steps.length - 1

                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex items-center">
                        <div
                          className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 transition-all ${
                            step.completed
                              ? "bg-[#0037C1] border-[#0037C1] text-white"
                              : step.active
                                ? "bg-[#0037C1]/10 border-[#0037C1] text-[#0037C1]"
                                : "bg-[#2A2A2A] border-[#2A2A2A] text-gray-500"
                          }`}
                        >
                          {step.completed ? (
                            <Check className="w-4 sm:w-5 h-4 sm:h-5" />
                          ) : (
                            <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                          )}
                        </div>
                        <div className="ml-2 sm:ml-3 hidden sm:block">
                          <p
                            className={`text-sm font-medium ${
                              step.active ? "text-[#0037C1]" : step.completed ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </div>
                      {!isLast && (
                        <div
                          className={`w-4 sm:w-8 lg:w-16 h-0.5 mx-1 sm:mx-2 lg:mx-4 ${step.completed ? "bg-[#0037C1]" : "bg-[#2A2A2A]"}`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Header Content */}
          <div className="pb-6 sm:pb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Choose Your <span className="text-[#0037C1]">Skip Size</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-4 sm:mb-6 px-4">
              Select the skip size that best suits your needs. All prices include VAT, delivery, and collection.
            </p>

            {/* Filters Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg hover:bg-[#3A3A3A] transition-colors text-white"
              >
                <Filter className="w-4 h-4" />
                <span>Advanced Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Waste Volume Slider */}
      <div className="bg-[#1C1C1C] border-b border-[#2A2A2A] py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">What are you disposing of?</h2>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">Drag the slider to estimate your waste volume</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative mb-6 sm:mb-8" ref={volumeSliderRef}>
              {/* Waste volume slider */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-400">Small projects</span>
                <span className="text-xs sm:text-sm text-gray-400">Large projects</span>
              </div>

              <div className="relative h-2 bg-[#2A2A2A] rounded-full">
                <div
                  className="absolute h-full bg-[#0037C1] rounded-full"
                  style={{ width: `${calculateThumbPosition(wasteVolume, 4, 40)}%` }}
                ></div>

                {/* Skip size markers */}
                {[4, 6, 8, 10, 12, 14, 16, 20, 40].map((size) => (
                  <div
                    key={size}
                    className={`absolute w-1 h-3 -mt-0.5 rounded-full ${
                      size <= wasteVolume ? "bg-[#0037C1]" : "bg-[#3A3A3A]"
                    }`}
                    style={{ left: `${calculateThumbPosition(size, 4, 40)}%` }}
                  ></div>
                ))}

                <input
                  type="range"
                  min="4"
                  max="40"
                  step="1"
                  value={wasteVolume}
                  onChange={handleWasteVolumeChange}
                  className="absolute w-full h-2 opacity-0 cursor-pointer"
                />

                {/* Tooltip */}
                <div
                  className="absolute -mt-14 sm:-mt-16 transform -translate-x-1/2 bg-[#0037C1] text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-lg flex flex-col items-center"
                  style={{ left: `${calculateThumbPosition(wasteVolume, 4, 40)}%` }}
                >
                  <span className="font-bold text-sm sm:text-base">{wasteVolume} Yards</span>
                  <span className="text-xs hidden sm:block">{closestWasteExample.example}</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#0037C1]"></div>
                </div>
              </div>

              {/* Skip size labels */}
              <div className="flex justify-between mt-1">
                {[4, 8, 12, 16, 20, 40].map((size) => (
                  <span key={size} className="text-xs text-gray-500">
                    {size}y
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended skip message */}
            <div className="text-center bg-[#0037C1]/10 border border-[#0037C1]/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-white text-sm sm:text-base">
                <span className="font-bold">Recommended:</span> Based on your waste volume, we suggest a{" "}
                <span className="text-[#0037C1] font-bold">
                  {skips.find((skip) => skip.size >= wasteVolume)?.size || 40} Yard Skip
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters with Sliders */}
      {showFilters && (
        <div className="bg-[#1A1A1A] border-b border-[#2A2A2A] py-4 sm:py-6 animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Size Range Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white flex items-center text-sm sm:text-base">
                    <Ruler className="w-4 h-4 mr-2" />
                    Skip Size Range
                  </h3>
                  <span className="text-sm text-[#0037C1]">
                    {sizeRange[0]} - {sizeRange[1]} Yards
                  </span>
                </div>

                <div className="relative" ref={sizeSliderRef}>
                  <div className="relative h-2 bg-[#2A2A2A] rounded-full">
                    <div
                      className="absolute h-full bg-[#0037C1] rounded-full"
                      style={{
                        left: `${calculateThumbPosition(sizeRange[0], 4, 40)}%`,
                        width: `${calculateThumbPosition(sizeRange[1], 4, 40) - calculateThumbPosition(sizeRange[0], 4, 40)}%`,
                      }}
                    ></div>

                    <input
                      type="range"
                      min="4"
                      max="40"
                      step="1"
                      value={sizeRange[0]}
                      onChange={(e) => handleSizeRangeChange(e, 0)}
                      className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
                    />

                    <input
                      type="range"
                      min="4"
                      max="40"
                      step="1"
                      value={sizeRange[1]}
                      onChange={(e) => handleSizeRangeChange(e, 1)}
                      className="absolute w-full h-2 opacity-0 cursor-pointer z-20"
                    />

                    {/* Thumbs */}
                    <div
                      className="absolute w-4 h-4 bg-white border-2 border-[#0037C1] rounded-full -mt-1 z-30"
                      style={{ left: `calc(${calculateThumbPosition(sizeRange[0], 4, 40)}% - 8px)` }}
                    ></div>

                    <div
                      className="absolute w-4 h-4 bg-white border-2 border-[#0037C1] rounded-full -mt-1 z-30"
                      style={{ left: `calc(${calculateThumbPosition(sizeRange[1], 4, 40)}% - 8px)` }}
                    ></div>
                  </div>

                  {/* Skip size labels */}
                  <div className="flex justify-between mt-2">
                    {[4, 8, 12, 16, 20, 40].map((size) => (
                      <span key={size} className="text-xs text-gray-500">
                        {size}y
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white flex items-center text-sm sm:text-base">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Price Range
                  </h3>
                  <span className="text-sm text-[#0037C1]">
                    £{priceRange[0]} - £{priceRange[1]}
                  </span>
                </div>

                <div className="relative" ref={priceSliderRef}>
                  <div className="relative h-2 bg-[#2A2A2A] rounded-full">
                    <div
                      className="absolute h-full bg-[#0037C1] rounded-full"
                      style={{
                        left: `${calculateThumbPosition(priceRange[0], 200, 1200)}%`,
                        width: `${calculateThumbPosition(priceRange[1], 200, 1200) - calculateThumbPosition(priceRange[0], 200, 1200)}%`,
                      }}
                    ></div>

                    <input
                      type="range"
                      min="200"
                      max="1200"
                      step="10"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(e, 0)}
                      className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
                    />

                    <input
                      type="range"
                      min="200"
                      max="1200"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(e, 1)}
                      className="absolute w-full h-2 opacity-0 cursor-pointer z-20"
                    />

                    {/* Thumbs */}
                    <div
                      className="absolute w-4 h-4 bg-white border-2 border-[#0037C1] rounded-full -mt-1 z-30"
                      style={{ left: `calc(${calculateThumbPosition(priceRange[0], 200, 1200)}% - 8px)` }}
                    ></div>

                    <div
                      className="absolute w-4 h-4 bg-white border-2 border-[#0037C1] rounded-full -mt-1 z-30"
                      style={{ left: `calc(${calculateThumbPosition(priceRange[1], 200, 1200)}% - 8px)` }}
                    ></div>
                  </div>

                  {/* Price labels */}
                  <div className="flex justify-between mt-2">
                    {[200, 400, 600, 800, 1000, 1200].map((price) => (
                      <span key={price} className="text-xs text-gray-500">
                        £{price}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Checkbox Filters */}
              <div className="md:col-span-2 flex flex-wrap gap-3 sm:gap-4 mt-2">
                <label className="flex items-center gap-2 px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg cursor-pointer hover:bg-[#3A3A3A]">
                  <input
                    type="checkbox"
                    checked={filterRoadOnly}
                    onChange={(e) => setFilterRoadOnly(e.target.checked)}
                    className="rounded border-[#3A3A3A] text-[#0037C1] focus:ring-[#0037C1] bg-[#2A2A2A]"
                  />
                  <span className="text-sm text-white">Road placement only</span>
                </label>
                <label className="flex items-center gap-2 px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg cursor-pointer hover:bg-[#3A3A3A]">
                  <input
                    type="checkbox"
                    checked={filterHeavyWaste}
                    onChange={(e) => setFilterHeavyWaste(e.target.checked)}
                    className="rounded border-[#3A3A3A] text-[#0037C1] focus:ring-[#0037C1] bg-[#2A2A2A]"
                  />
                  <span className="text-sm text-white">Heavy waste allowed</span>
                </label>

                {/* Results count */}
                <div className="ml-auto px-3 py-2 bg-[#0037C1]/10 border border-[#0037C1]/30 rounded-lg">
                  <span className="text-sm text-white">
                    <span className="font-bold text-[#0037C1]">{sortedSkips.length}</span> skips match your filters
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32">
        {/* Mobile Slider (visible on mobile and tablet) */}
        <div className="lg:hidden">
          {/* Slider Navigation */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Available Skips</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`p-2 rounded-full transition-colors ${
                  currentSlide === 0
                    ? "bg-[#2A2A2A] text-gray-500 cursor-not-allowed"
                    : "bg-[#0037C1] text-white hover:bg-[#0037C1]/90"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-400 px-2">
                {currentSlide + 1} of {sortedSkips.length}
              </span>
              <button
                onClick={nextSlide}
                disabled={currentSlide === sortedSkips.length - 1}
                className={`p-2 rounded-full transition-colors ${
                  currentSlide === sortedSkips.length - 1
                    ? "bg-[#2A2A2A] text-gray-500 cursor-not-allowed"
                    : "bg-[#0037C1] text-white hover:bg-[#0037C1]/90"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Slider Container */}
          <div className="relative overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {sortedSkips.map((skip) => {
                const price = calculatePrice(skip)
                const isSelected = selectedSkip?.id === skip.id
                const recommendation = skipRecommendations[skip.size as keyof typeof skipRecommendations]
                const isRecommended = skip.size >= wasteVolume && skip.size <= wasteVolume + 2

                return (
                  <div key={skip.id} className="w-full flex-shrink-0 px-2">
                    <div
                      className={`relative bg-[#1C1C1C] rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "border-[#0037C1] shadow-lg shadow-[#0037C1]/20"
                          : isRecommended
                            ? "border-[#0037C1]/50"
                            : "border-[#2A2A2A]"
                      }`}
                      onClick={() => handleSkipSelect(skip)}
                    >
                      {/* Recommended Badge */}
                      {isRecommended && !isSelected && (
                        <div className="absolute -top-3 left-4 bg-gradient-to-r from-[#0037C1] to-[#0037C1]/80 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg z-10">
                          <Star className="w-3 h-3 inline mr-1" />
                          Recommended
                        </div>
                      )}

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute -top-3 -right-3 bg-[#0037C1] text-white rounded-full p-2 shadow-lg z-10">
                          <Check className="w-4 h-4" />
                        </div>
                      )}

                      <div className="p-4">
                        {/* Skip Visual */}
                        <div className="relative mb-4">
                          <div className="aspect-[4/3] bg-gradient-to-br from-[#2A2A2A] via-[#1C1C1C] to-[#2A2A2A] rounded-xl flex items-center justify-center relative overflow-hidden border border-[#3A3A3A]">
                            {/* Skip illustration */}
                            <div className="relative">
                              <div
                                className="bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-lg transform perspective-1000 rotate-y-12 shadow-lg"
                                style={{
                                  width: `${Math.min(60 + skip.size * 1.5, 100)}px`,
                                  height: `${Math.min(30 + skip.size * 0.8, 60)}px`,
                                }}
                              >
                                <div className="absolute inset-x-1 top-0.5 h-1.5 bg-yellow-300 rounded-sm"></div>
                                <div className="absolute inset-x-1 bottom-0.5 h-0.5 bg-yellow-600 rounded-sm"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-[#0037C1] text-[5px] font-bold transform -rotate-12">WWW</div>
                                </div>
                              </div>
                              <div className="absolute -bottom-1 -left-1 w-4 h-2 bg-gray-600 rounded-full"></div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-2 bg-gray-600 rounded-full"></div>
                            </div>
                          </div>

                          {/* Size Badge */}
                          <div className="absolute top-3 right-3 bg-[#0037C1] text-white px-2 py-1 rounded-full font-bold text-xs shadow-lg">
                            {skip.size} Yard{skip.size !== 1 ? "s" : ""}
                          </div>

                          {/* Capacity Indicator */}
                          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium text-white">
                            ~{skip.size * 1.5}m³
                          </div>
                        </div>

                        {/* Skip Info */}
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{skip.size} Yard Skip</h3>
                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{recommendation}</p>
                          </div>

                          {/* Features Grid */}
                          <div className="grid grid-cols-2 gap-1">
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-400">{skip.hire_period_days} days</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              {skip.allowed_on_road ? (
                                <>
                                  <Truck className="w-3 h-3 text-[#0037C1]" />
                                  <span className="text-[#0037C1]">Road OK</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                  <span className="text-yellow-500">Private only</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Weight className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-400">
                                {skip.allows_heavy_waste ? "Heavy OK" : "Light only"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Truck className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-400">Free delivery</span>
                            </div>
                          </div>

                          {/* Pricing */}
                          <div className="bg-[#2A2A2A] rounded-xl p-3 space-y-1 border border-[#3A3A3A]">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xl font-bold text-[#0037C1]">£{price}</span>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">inc. VAT</div>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Base: £{skip.price_before_vat}</span>
                              <span>VAT: £{Math.round((skip.price_before_vat * skip.vat) / 100)}</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                              isSelected
                                ? "bg-[#0037C1] text-white shadow-lg shadow-[#0037C1]/30"
                                : "bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] border border-[#3A3A3A]"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSkipSelect(skip)
                            }}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-4 h-4" />
                                Selected
                              </>
                            ) : (
                              <>
                                Select This Skip
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {sortedSkips.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-[#0037C1]" : "bg-[#2A2A2A]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid (hidden on mobile and tablet) */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {sortedSkips.map((skip) => {
            const price = calculatePrice(skip)
            const isSelected = selectedSkip?.id === skip.id
            const recommendation = skipRecommendations[skip.size as keyof typeof skipRecommendations]
            const isRecommended = skip.size >= wasteVolume && skip.size <= wasteVolume + 2

            return (
              <div
                key={skip.id}
                className={`group relative bg-[#1C1C1C] rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-[#0037C1]/10 hover:-translate-y-1 ${
                  isSelected
                    ? "border-[#0037C1] shadow-lg shadow-[#0037C1]/20"
                    : isRecommended
                      ? "border-[#0037C1]/50"
                      : "border-[#2A2A2A] hover:border-[#0037C1]/50"
                }`}
                onClick={() => handleSkipSelect(skip)}
              >
                {/* Recommended Badge */}
                {isRecommended && !isSelected && (
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-[#0037C1] to-[#0037C1]/80 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg z-10">
                    <Star className="w-3 h-3 inline mr-1" />
                    Recommended
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-[#0037C1] text-white rounded-full p-2 shadow-lg z-10 animate-in zoom-in duration-200">
                    <Check className="w-5 h-5" />
                  </div>
                )}

                <div className="p-6">
                  {/* Skip Visual */}
                  <div className="relative mb-6">
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#2A2A2A] via-[#1C1C1C] to-[#2A2A2A] rounded-xl flex items-center justify-center relative overflow-hidden border border-[#3A3A3A]">
                      {/* Skip illustration with yellow color like their brand */}
                      <div className="relative">
                        <div
                          className="bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-lg transform perspective-1000 rotate-y-12 shadow-lg"
                          style={{
                            width: `${Math.min(80 + skip.size * 2, 140)}px`,
                            height: `${Math.min(40 + skip.size, 80)}px`,
                          }}
                        >
                          <div className="absolute inset-x-2 top-1 h-2 bg-yellow-300 rounded-sm"></div>
                          <div className="absolute inset-x-2 bottom-1 h-1 bg-yellow-600 rounded-sm"></div>
                          {/* We Want Waste logo simulation */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-[#0037C1] text-[6px] font-bold transform -rotate-12">WWW</div>
                          </div>
                        </div>
                        <div className="absolute -bottom-2 -left-2 w-6 h-3 bg-gray-600 rounded-full"></div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-3 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>

                    {/* Size Badge */}
                    <div className="absolute top-4 right-4 bg-[#0037C1] text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
                      {skip.size} Yard{skip.size !== 1 ? "s" : ""}
                    </div>

                    {/* Capacity Indicator */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                      ~{skip.size * 1.5}m³ capacity
                    </div>
                  </div>

                  {/* Skip Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{skip.size} Yard Skip</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{recommendation}</p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400">{skip.hire_period_days} days hire</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {skip.allowed_on_road ? (
                          <>
                            <Truck className="w-3 h-3 text-[#0037C1]" />
                            <span className="text-[#0037C1]">Road OK</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 text-yellow-500" />
                            <span className="text-yellow-500">Private only</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Weight className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400">
                          {skip.allows_heavy_waste ? "Heavy waste OK" : "Light waste only"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Truck className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400">Free delivery</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-[#2A2A2A] rounded-xl p-4 space-y-2 border border-[#3A3A3A]">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-[#0037C1]">£{price}</span>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">inc. VAT</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Base price: £{skip.price_before_vat}</span>
                        <span>VAT: £{Math.round((skip.price_before_vat * skip.vat) / 100)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isSelected
                          ? "bg-[#0037C1] text-white shadow-lg shadow-[#0037C1]/30 hover:bg-[#0037C1]/90"
                          : "bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] hover:border-[#0037C1] border border-[#3A3A3A]"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSkipSelect(skip)
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" />
                          Selected
                        </>
                      ) : (
                        <>
                          Select This Skip
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Help Section */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-[#1C1C1C] to-[#2A2A2A] rounded-2xl p-6 sm:p-8 text-center border border-[#3A3A3A]">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[#0037C1]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-6 sm:w-8 h-6 sm:h-8 text-[#0037C1]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Need Help Choosing?</h3>
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Not sure which skip size is right for your project? Our expert team can help you choose the perfect size
              and ensure you get the best value for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="px-4 sm:px-6 py-3 bg-[#0037C1] text-white rounded-xl font-semibold hover:bg-[#0037C1]/90 transition-colors text-sm sm:text-base">
                Get Expert Advice
              </button>
              <button className="px-4 sm:px-6 py-3 bg-transparent text-[#0037C1] border border-[#0037C1] rounded-xl font-semibold hover:bg-[#0037C1]/10 transition-colors text-sm sm:text-base">
                View Size Guide
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Sticky Bottom Bar */}
      {selectedSkip && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1C]/95 backdrop-blur-lg border-t border-[#2A2A2A] shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Disclaimer */}
            <div className="py-2 text-xs text-gray-500 text-center border-b border-[#2A2A2A]">
              Imagery and information shown may not reflect exact specifications. Additional options may incur extra
              costs.
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white">{selectedSkip.size} Yard Skip</h3>
                  <p className="text-sm text-gray-400">{selectedSkip.hire_period_days} day hire period</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#0037C1]">£{calculatePrice(selectedSkip)}</div>
                  <div className="text-xs text-gray-500">inc. VAT & delivery</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleBack}
                  className="py-3 px-4 border border-[#3A3A3A] text-white rounded-xl font-semibold hover:bg-[#2A2A2A] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="py-3 px-4 bg-[#0037C1] text-white rounded-xl font-semibold hover:bg-[#0037C1]/90 transition-colors shadow-lg shadow-[#0037C1]/30"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between py-4">
              <div className="flex items-center gap-8">
                <div>
                  <h3 className="font-bold text-white">{selectedSkip.size} Yard Skip Selected</h3>
                  <p className="text-sm text-gray-400">{selectedSkip.hire_period_days} day hire period</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#0037C1]">£{calculatePrice(selectedSkip)}</div>
                  <div className="text-xs text-gray-500">inc. VAT & delivery</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="py-3 px-6 border border-[#3A3A3A] text-white rounded-xl font-semibold hover:bg-[#2A2A2A] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="py-3 px-8 bg-[#0037C1] text-white rounded-xl font-semibold hover:bg-[#0037C1]/90 transition-colors flex items-center gap-2 shadow-lg shadow-[#0037C1]/30"
                >
                  Continue to Permits
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
