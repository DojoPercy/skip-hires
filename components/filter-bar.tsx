"use client"

import { Filter, Check } from "lucide-react"

interface FilterBarProps {
  filterRoadOnly: boolean
  filterHeavyWaste: boolean
  onFilterChange: (filterType: string, value: boolean) => void
  totalSkips: number
  filteredSkips: number
}

export default function FilterBar({
  filterRoadOnly,
  filterHeavyWaste,
  onFilterChange,
  totalSkips,
  filteredSkips,
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <FilterButton
            label="Road Placement Only"
            isActive={filterRoadOnly}
            onClick={() => onFilterChange("road", !filterRoadOnly)}
          />

          <FilterButton
            label="Heavy Waste Allowed"
            isActive={filterHeavyWaste}
            onClick={() => onFilterChange("heavy", !filterHeavyWaste)}
          />
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredSkips}</span> of{" "}
          {totalSkips} skips
        </div>
      </div>
    </div>
  )
}

interface FilterButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
}

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isActive
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      }`}
      onClick={onClick}
    >
      {isActive && <Check className="h-4 w-4 mr-1" />}
      {label}
    </button>
  )
}
