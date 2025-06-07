"use client"

import { motion } from "framer-motion"
import { X, ArrowRight, Calendar, Truck } from "lucide-react"

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

interface SelectedSkipSummaryProps {
  skip: Skip
  onContinue: () => void
  onDeselect: () => void
}

export default function SelectedSkipSummary({ skip, onContinue, onDeselect }: SelectedSkipSummaryProps) {
  const totalPrice = Math.round(skip.price_before_vat * (1 + skip.vat / 100))

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-2xl z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Skip Info */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">{skip.size} Yard Skip Selected</h3>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4 mr-1" />
                {skip.hire_period_days} day hire period
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">£{totalPrice}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">inc. VAT & delivery</div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onDeselect}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={onContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Mobile Price Display */}
        <div className="sm:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Total Price:</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">£{totalPrice}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
