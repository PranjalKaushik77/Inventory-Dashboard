"use client"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js"

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

interface VisualizationData {
  bar_labels: string[]
  bar_values: number[]
  bar_colors: string[]
  pie_labels: string[]
  pie_values: number[]
  pie_colors: string[]
  color_counts: Record<string, number>
}

export default function DataVisualization({ data }: { data: VisualizationData }) {
  // Prepare the data for the Bar chart
  const barData = {
    labels: data.bar_labels,
    datasets: [
      {
        data: data.bar_values,
        backgroundColor: data.bar_colors,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  }

  // Prepare the data for the Pie chart
  const pieData = {
    labels: data.pie_labels,
    datasets: [
      {
        data: data.pie_values,
        backgroundColor: data.pie_colors,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  }

  // Define status colors and labels
  const statusConfig = {
    red: {
      label: "Overstocked",
      bgClass: "bg-red-500",
      textClass: "text-red-500",
      iconPath: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    green: {
      label: "Normal",
      bgClass: "bg-green-500",
      textClass: "text-green-500",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    yellow: {
      label: "Understocked",
      bgClass: "bg-yellow-500",
      textClass: "text-yellow-500",
      iconPath:
        "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    },
    orange: {
      label: "Critical",
      bgClass: "bg-purple-600",
      textClass: "text-purple-600",
      iconPath: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(data.color_counts).map(([color, count]) => {
          const config = statusConfig[color as keyof typeof statusConfig] || {
            label: color,
            bgClass: "bg-blue-500",
            textClass: "text-blue-500",
            iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          }

          return (
            <div key={color} className="card overflow-hidden">
              <div className={`h-2 ${config.bgClass}`}></div>
              <div className="p-6 flex items-center">
                <div className={`rounded-full p-3 ${config.bgClass} bg-opacity-10 mr-4`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${config.textClass}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.iconPath} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{config.label}</p>
                  <h3 className="text-2xl font-bold">{count}</h3>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
            <h2 className="card-title m-0">Inventory Distribution</h2>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(156, 163, 175, 0.1)",
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: "circle",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
            <h2 className="card-title m-0">Stock Status</h2>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: "circle",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

