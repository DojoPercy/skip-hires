"use client"

import { motion } from "framer-motion"

export default function PageHeader() {
  return (
    <div className="bg-white dark:bg-slate-800 py-8 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">Choose Your Skip Size</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select the perfect skip size for your project. All prices include delivery, collection, and VAT.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
