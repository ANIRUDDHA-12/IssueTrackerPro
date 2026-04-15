"use client"

import { useState } from "react"
import { createIssue } from "@/app/actions/issues"

export default function CreateIssueModal(){
    // State to control if modal is visible
    const [ isOpen,setIsOpen]= useState(false)
    const [isLoading,setIsLoading]=useState(false)
    const[error,setError]=useState<string | null>(null)

    async function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        // grab the data from the form
    const formData = new FormData(e.currentTarget)

    // calling the server action
    const result = await createIssue(formData)

    if(!result.success&& result.error){
        setError(result.error)
        setIsLoading(false)
    }
    else{
        // If successful, close the modal. (The Server Action handles the redirect/refresh.)
        setIsOpen(false)
        setIsLoading(false)
    }
    }

    return (
    <>
      {/* 1. The Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + New Issue
      </button>

      {/* 2. The Modal Overlay (Only renders if isOpen is true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          
          {/* 3. The Modal Container */}
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create New Issue</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 4. The Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="e.g., Login button is broken"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Describe the issue in detail..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    name="priority"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="BUG">Bug</option>
                    <option value="FEATURE">Feature</option>
                    <option value="TASK">Task</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isLoading ? "Creating..." : "Create Issue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
    
}