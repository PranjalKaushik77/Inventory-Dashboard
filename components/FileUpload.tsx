"use client"
import type React from "react"
import { useState } from "react"
import { CloudArrowUpIcon, ArrowPathIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"

interface FileUploadProps {
  onDataProcessed: (data: any) => void
}

export default function FileUpload({ onDataProcessed }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.detail || "Upload failed")
      }

      const data = await response.json()
      onDataProcessed(data)
      setError(null)
      // Optionally reset the file state to allow re-uploading
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700/30 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {file ? (
                <div className="text-center">
                  <CloudArrowUpIcon className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{file.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <>
                  <CloudArrowUpIcon className="w-8 h-8 mb-2 text-slate-500 dark:text-slate-400" />
                  <p className="mb-1 text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">CSV or XLSX files only</p>
                </>
              )}
            </div>
            <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} className="hidden" disabled={loading} />
          </label>
        </div>

        {error && (
          <div
            className="flex items-center p-4 text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-300"
            role="alert"
          >
            <ExclamationCircleIcon className="flex-shrink-0 w-5 h-5 mr-2" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full h-12 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          disabled={!file || loading}
        >
          {loading ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                  clipRule="evenodd"
                />
              </svg>
              Analyze Inventory
            </>
          )}
        </button>
      </form>
    </div>
  )
}

