"use client"

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react"; // Added useEffect
import { createIssue, searchIssues, SearchResult } from "@/app/actions/issues"; 
import toast from "react-hot-toast";


export default function CreateIssueModal(){
    // State to control if modal is visible
    const [ isOpen,setIsOpen]= useState(false)
    const [isLoading,setIsLoading]=useState(false)
    const[error,setError]=useState<string | null>(null)

    // for duplicate detection state
    const[title,setTitle]= useState("")
    const [duplicates, setDuplicates] = useState<SearchResult[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(()=>{
      if(title.length<5){
        setDuplicates([])
        return
      }

      const delayTimer = setTimeout(async ()=>{
        setIsChecking(true)
        const results = await searchIssues(title)
        console.log("RAW AI RESULTS:", results);

        if(results){
          // filtering for 80% matches amongst present tickets
          const highMatches = results.filter(ticket=>ticket.similarity>=0.60)
          console.log("2. FILTERED MATCHES:", highMatches);
          setDuplicates(highMatches)
          setIsChecking(false)
        }
        return ()=>clearTimeout(delayTimer)
      },800)
    },[title])

    // 1. Initialize the router
  const router = useRouter();
  const pathname = usePathname();

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
        toast.success("Closing")
        setIsLoading(false)
        setIsOpen(false)
    }
    router.replace(pathname)
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
                <label className="block text-sm font-medium text-gray-700">
                    Title {isChecking && <span className="text-xs text-blue-500 font-normal ml-2">AI is analyzing...</span>}
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="e.g., Login button is broken"
                />
              </div>

              {/* --- AI DUPLICATE WARNING BANNER --- */}
              {duplicates.length > 0 && (
                <div className="rounded bg-orange-50 p-4 border border-orange-200">
                  <h3 className="text-sm font-bold text-orange-800 flex items-center gap-2">
                    ⚠️ Possible Duplicate Detected
                  </h3>
                  <ul className="mt-2 flex flex-col gap-2">
                      {duplicates.map(ticket => (
                          <li key={ticket.id} className="text-xs bg-white p-2 rounded border border-orange-100 flex justify-between items-center text-gray-800">
                              <span className="font-semibold truncate pr-2">{ticket.title}</span>
                              <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full whitespace-nowrap">
                                  {Math.round(ticket.similarity * 100)}% Match
                              </span>
                          </li>
                      ))}
                  </ul>
                </div>
              )}

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