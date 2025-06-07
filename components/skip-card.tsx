"use client"

import { motion } from "framer-motion"
import { Check, Calendar, Truck, Weight, AlertTriangle, Zap } from "lucide-react"
import Image from "next/image"

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

interface SkipCardProps {
  skip: Skip
  isSelected: boolean
  onSelect: () => void
}

// Function to get the correct image based on skip size
const getSkipImage = (size: number): string => {
  if (size === 4) return "/images/4-yarder-skip.jpg"
  if (size >= 5 && size <= 8) return "/images/6-yarder-skip.jpg" // Using 6-yarder for 5-8 range
  if (size >= 10 && size <= 14) return "/images/6-yarder-skip.jpg" // Using same image for 10-14
  if (size === 16) return "/images/16-yarder-skip.jpg"
  if (size >= 20) return "/images/20-yarder-skip.jpg" // Using 20-yarder for 20 and 40
  return "/images/6-yarder-skip.jpg" // Default fallback
}

export default function SkipCard({ skip, isSelected, onSelect }: SkipCardProps) {
  const totalPrice = Math.round(skip.price_before_vat * (1 + skip.vat / 100))
  const skipImage = getSkipImage(skip.size)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${
        isSelected ? "ring-4 ring-blue-500 shadow-2xl" : "shadow-lg hover:shadow-xl"
      }`}
    >
      {/* Header with Skip Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
        {/* Real Skip Image */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <Image
            src={skipImage || "/placeholder.svg"}
            alt={`${skip.size} Yard Skip`}
            width={300}
            height={200}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Size Badge */}
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg z-10">
          {skip.size} Yard{skip.size !== 1 ? "s" : ""}
        </div>

        {/* Special Badges */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
          {!skip.allowed_on_road && (
            <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Permit Required
            </div>
          )}
          {skip.allows_heavy_waste && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
              <Zap className="w-3 h-3 mr-1" />
              Heavy Duty
            </div>
          )}
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10"
          >
            <Check className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{skip.size} Yard Skip</h3>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            {skip.hire_period_days} days
          </div>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Truck className="w-4 h-4 mr-2 text-blue-500" />
            {skip.allowed_on_road ? "Road OK" : "Private only"}
          </div>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 col-span-2">
            <Weight className="w-4 h-4 mr-2 text-blue-500" />
            {skip.allows_heavy_waste ? "Heavy waste allowed" : "Light waste only"}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">£{totalPrice}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">inc. VAT</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">Base: £{skip.price_before_vat}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                VAT: £{Math.round((skip.price_before_vat * skip.vat) / 100)}
              </div>
            </div>
          </div>
        </div>

        {/* Select Button */}
        <button
          onClick={onSelect}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            isSelected
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
          }`}
        >
          {isSelected ? (
            <span className="flex items-center justify-center">
              <Check className="w-5 h-5 mr-2" />
              Selected
            </span>
          ) : (
            "Select This Skip"
          )}
        </button>
      </div>
    </motion.div>
  )
}
