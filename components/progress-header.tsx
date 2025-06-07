"use client"

import { motion } from "framer-motion"
import { MapPin, Trash2, Truck, Shield, Calendar, CreditCard, Check } from "lucide-react"

const steps = [
  { id: "postcode", label: "Postcode", icon: MapPin, completed: true },
  { id: "waste-type", label: "Waste Type", icon: Trash2, completed: true },
  { id: "select-skip", label: "Select Skip", icon: Truck, current: true },
  { id: "permit-check", label: "Permit Check", icon: Shield, upcoming: true },
  { id: "choose-date", label: "Choose Date", icon: Calendar, upcoming: true },
  { id: "payment", label: "Payment", icon: CreditCard, upcoming: true },
]

export default function ProgressHeader() {
  return (
    <div className="bg-slate-900 text-white py-4 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1

            return (
              <div key={step.id} className="flex items-center min-w-0">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center"
                >
                  {/* Step Icon */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                      step.completed
                        ? "bg-blue-600 border-blue-600 text-white"
                        : step.current
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-600 text-slate-400"
                    }`}
                  >
                    {step.completed ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>

                  {/* Step Label */}
                  <div className="ml-3 hidden sm:block">
                    <span
                      className={`text-sm font-medium ${
                        step.completed || step.current ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </motion.div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`flex-1 h-0.5 mx-4 min-w-[20px] sm:min-w-[40px] ${
                      step.completed ? "bg-blue-600" : "bg-slate-600"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile Step Labels */}
        <div className="sm:hidden mt-3 text-center">
          <span className="text-sm text-slate-400">Step 3 of 6:</span>
          <span className="text-sm font-medium text-white ml-1">Select Skip</span>
        </div>
      </div>
    </div>
  )
}
