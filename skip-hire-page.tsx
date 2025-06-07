"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Trash2, Truck, Shield, Calendar, CreditCard, ArrowRight, AlertTriangle } from "lucide-react"

const steps = [
  { id: "postcode", label: "Postcode", icon: MapPin, active: true, completed: true },
  { id: "waste-type", label: "Waste Type", icon: Trash2, active: true, completed: true },
  { id: "select-skip", label: "Select Skip", icon: Truck, active: true, completed: false },
  { id: "permit-check", label: "Permit Check", icon: Shield, active: false, completed: false },
  { id: "choose-date", label: "Choose Date", icon: Calendar, active: false, completed: false },
  { id: "payment", label: "Payment", icon: CreditCard, active: false, completed: false },
]

const skips = [
  {
    id: "4-yard",
    name: "4 Yard Skip",
    size: "4 Yards",
    price: "£211",
    hirePeriod: "14 day hire period",
    image: "/placeholder.svg?height=192&width=400",
    roadAllowed: true,
  },
  {
    id: "5-yard",
    name: "5 Yard Skip",
    size: "5 Yards",
    price: "£241",
    hirePeriod: "14 day hire period",
    image: "/placeholder.svg?height=192&width=400",
    roadAllowed: true,
  },
  {
    id: "6-yard",
    name: "6 Yard Skip",
    size: "6 Yards",
    price: "£264",
    hirePeriod: "14 day hire period",
    image: "/placeholder.svg?height=192&width=400",
    roadAllowed: true,
  },
  {
    id: "8-yard",
    name: "8 Yard Skip",
    size: "8 Yards",
    price: "£295",
    hirePeriod: "14 day hire period",
    image: "/placeholder.svg?height=192&width=400",
    roadAllowed: true,
  },
  {
    id: "10-yard",
    name: "10 Yard Skip",
    size: "10 Yards",
    price: "£356",
    hirePeriod: "14 day hire period",
    image: "/placeholder.svg?height=192&width=400",
    roadAllowed: false,
  },
  {
    id: "12-yard",
    name: "12 Yard Skip",
    size: "12 Yards",
    price: "£390",
    hirePeriod: "14 day hire period",
    image: "/placeholder.svg?height=192&width=400",
    roadAllowed: false,
  },
  {
    id: "14-yard",
    name: "14 Yard Skip",
    size: "14 Yards",
    price: "£434",
    hirePeriod: "14 day hire period",
    image: "/placeholder.svg?height=192&width=400",
    roadAllowed: false,
  },
  {
    id: "16-yard",
    name: "16 Yard Skip",
    size: "16 Yards",
    price: "£510",
    hirePeriod: "7 day hire period",
    image: "/placeholder.svg?height=192&width=400",
    roadAllowed: false,
  },
  {
    id: "20-yard",
    name: "20 Yard Skip",
    size: "20 Yards",
    price: "£802",
    hirePeriod: "14 day hire period",
    image: "/placeholder.svg?height=192&width=400",
    roadAllowed: false,
  },
  {
    id: "40-yard",
    name: "40 Yard Skip",
    size: "40 Yards",
    price: "£877",
    hirePeriod: "14 day hire period",
    image: "/placeholder.svg?height=192&width=400",
    roadAllowed: false,
  },
]

export default function SkipHirePage() {
  const [selectedSkip, setSelectedSkip] = useState<string | null>(null)

  const handleSkipSelect = (skipId: string) => {
    setSelectedSkip(skipId)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Stepper */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isLast = index === steps.length - 1

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    className={`flex items-center whitespace-nowrap transition-colors ${
                      step.active
                        ? "text-[#0037C1] cursor-pointer hover:text-[#0037C1]"
                        : "text-white/60 cursor-not-allowed opacity-50"
                    }`}
                    disabled={!step.active}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="ml-2 text-white">{step.label}</span>
                  </button>
                  {!isLast && <div className={`w-16 h-px ml-4 ${step.completed ? "bg-[#0037C1]" : "bg-[#2A2A2A]"}`} />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Skip Selection */}
        <div className="max-w-7xl mx-auto px-4 pb-32">
          <h2 className="text-2xl font-bold text-center mb-4">Choose Your Skip Size</h2>
          <p className="text-gray-400 text-center mb-8">Select the skip size that best suits your needs</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {skips.map((skip) => (
              <div
                key={skip.id}
                className={`group relative rounded-lg border-2 p-4 md:p-6 transition-all cursor-pointer
                  ${
                    selectedSkip === skip.id
                      ? "border-[#0037C1] bg-[#1C1C1C]"
                      : "border-[#2A2A2A] hover:border-[#0037C1]/50 bg-[#1C1C1C]"
                  } text-white`}
                onClick={() => handleSkipSelect(skip.id)}
              >
                <div className="relative">
                  <Image
                    src={skip.image || "/placeholder.svg"}
                    alt={skip.name}
                    width={400}
                    height={192}
                    className="w-full h-36 md:h-48 object-cover rounded-md mb-4"
                  />

                  {/* Size Badge */}
                  <div className="absolute top-3 right-2 z-20 bg-[#0037C1] text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                    {skip.size}
                  </div>

                  {/* Road Warning */}
                  {!skip.roadAllowed && (
                    <div className="absolute bottom-3 left-2 z-20">
                      <div className="bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                        <span className="text-xs font-medium text-yellow-500">Not Allowed On The Road</span>
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{skip.name}</h3>
                <p className="text-sm text-gray-400 mb-4 md:mb-6">{skip.hirePeriod}</p>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xl md:text-2xl font-bold text-[#0037C1]">{skip.price}</span>
                  </div>
                </div>

                <button
                  className={`w-full py-2.5 md:py-3 px-4 rounded-md transition-all flex items-center justify-center space-x-2
                    ${
                      selectedSkip === skip.id
                        ? "bg-[#0037C1] text-white hover:bg-[#0037C1]/90"
                        : "bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] hover:border-[#0037C1]"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSkipSelect(skip.id)
                  }}
                >
                  <span>{selectedSkip === skip.id ? "Selected" : "Select This Skip"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
