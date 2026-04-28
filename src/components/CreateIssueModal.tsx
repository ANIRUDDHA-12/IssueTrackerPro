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
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-all duration-200"
      >
        + New Issue
      </button>

      {/* 2. The Modal Overlay (Only renders if isOpen is true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          
          {/* 3. The Modal Container */}
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-gray-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Create New Issue</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 4. The Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-slate-900">
                    Title {isChecking && <span className="text-xs text-indigo-500 font-normal ml-2">AI is analyzing...</span>}
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  placeholder="e.g., Login button is broken"
                />
              </div>

              {/* --- AI DUPLICATE WARNING BANNER --- */}
              {duplicates.length > 0 && (
                <div className="rounded-lg bg-orange-50 p-4 border border-orange-200">
                  <h3 className="text-sm font-bold text-orange-800 flex items-center gap-2">
                    ⚠️ Possible Duplicate Detected
                  </h3>
                  <ul className="mt-2 flex flex-col gap-2">
                      {duplicates.map(ticket => (
                          <li key={ticket.id} className="text-xs bg-white p-2 rounded-lg border border-orange-100 flex justify-between items-center text-slate-800">
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
                <label className="block text-sm font-medium text-slate-900">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  placeholder="Describe the issue in detail..."
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-gray-100 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400 transition-all duration-200"
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