"use client"
import { useState } from "react"
import FileUpload from "../components/FileUpload"
import ProductLists from "../components/ProductLists"
import DataVisualization from "../components/DataVisualization"

// Define an interface matching the structure of your analysis data
interface AnalysisData {
  overstocked: { name: string; vendor: string }[]
  understocked: { name: string; vendor: string }[]
  critical: { name: string; vendor: string }[]
  bar_labels: string[]
  bar_values: number[]
  bar_colors: string[]
  pie_labels: string[]
  pie_values: number[]
  pie_colors: string[]
  color_counts: Record<string, number>
  charts: {
    bar: string // base64 string of the bar chart image
    pie: string // base64 string of the pie chart image
  }
}

export default function InventoryAnalysis() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-12">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 mb-8">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Inventory Analysis Dashboard
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8 border border-slate-200 dark:border-slate-700">
          <FileUpload onDataProcessed={setAnalysisData} />
        </div>

        {analysisData && (
          <div className="space-y-8 animate-fadeIn">
            <ProductLists data={analysisData} />
            <DataVisualization data={analysisData} />
          </div>
        )}

        {!analysisData && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xl">Upload a file to see inventory analysis</p>
          </div>
        )}
      </main>
    </div>
  )
}

