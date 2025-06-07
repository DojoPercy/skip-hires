"use client"

import { motion } from "framer-motion"
import { SlidersHorizontal, Check, X } from "lucide-react"

interface FilterPanelProps {
  filters: {
    roadOnly: boolean
    heavyWaste: boolean
    priceRange: [number, number]
    sizeRange: [number, number]
  }
  onFiltersChange: (filters: any) => void
  totalSkips: number
  filteredCount: number
}

export default function FilterPanel({ filters, onFiltersChange, totalSkips, filteredCount }: FilterPanelProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    onFiltersChange({
      roadOnly: false,
      heavyWaste: false,
      priceRange: [0, 1500],
      sizeRange: [4, 40],
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sticky top-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <SlidersHorizontal className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Filters</h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center"
        >
          <X className="w-4 h-4 mr-1" />
          Reset
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-sm text-blue-600 dark:text-blue-400">
          Showing <span className="font-bold">{filteredCount}</span> of {totalSkips} skips
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-slate-700 dark:text-slate-300">Quick Filters</h4>

        <FilterToggle
          label="Road Placement Only"
          description="Skips that can be placed on public roads"
          checked={filters.roadOnly}
          onChange={(checked) => updateFilter("roadOnly", checked)}
        />

        <FilterToggle
          label="Heavy Waste Allowed"
          description="Suitable for construction debris and heavy materials"
          checked={filters.heavyWaste}
          onChange={(checked) => updateFilter("heavyWaste", checked)}
        />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>£{filters.priceRange[0]}</span>
            <span>£{filters.priceRange[1]}</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1500"
              step="50"
              value={filters.priceRange[1]}
              onChange={(e) => updateFilter("priceRange", [filters.priceRange[0], Number.parseInt(e.target.value)])}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Size Range */}
      <div>
        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Skip Size (Yards)</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>{filters.sizeRange[0]} yards</span>
            <span>{filters.sizeRange[1]} yards</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="4"
              max="40"
              step="2"
              value={filters.sizeRange[1]}
              onChange={(e) => updateFilter("sizeRange", [filters.sizeRange[0], Number.parseInt(e.target.value)])}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface FilterToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function FilterToggle({ label, description, checked, onChange }: FilterToggleProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        checked
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
      }`}
      onClick={() => onChange(!checked)}
    >
      <div className="flex items-start">
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 mt-0.5 ${
            checked ? "bg-blue-500 border-blue-500" : "border-slate-300 dark:border-slate-500"
          }`}
        >
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
        <div>
          <div className="font-medium text-slate-800 dark:text-white">{label}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{description}</div>
        </div>
      </div>
    </div>
  )
}
