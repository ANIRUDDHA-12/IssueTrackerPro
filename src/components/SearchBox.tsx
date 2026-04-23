"use client"

import {useState,useTransition} from "react"
import { SearchResult } from "@/app/actions/issues";
import { searchIssues } from "@/app/actions/issues";


export default function SearchBox(){
    const[query,setQuery]= useState("")
    const [results, setResults] = useState<SearchResult[] | null>(null);

    const[isSearching,startTransition]=useTransition()

    const handleSearch =(e:React.SubmitEvent)=>{
        e.preventDefault()
        if(!query.trim()) return

        startTransition(async ()=>{
            const aiMatches = await searchIssues(query)
            setResults(aiMatches)
        })
    }
    return (
        <div className="mb-8 w-full max-w-2xl">
            {/* The Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask the AI to find a ticket (e.g. 'auth is broken')..."
                    className="flex-1 p-3 rounded-lg border border-gray-300 text-black"
                />
                <button 
                    type="submit" 
                    disabled={isSearching}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {isSearching ? "Thinking..." : "AI Search"}
                </button>
            </form>

            {/* The Results Overlay */}
            {results && results.length > 0 && (
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">
                        AI Semantic Matches
                    </h3>
                    <ul className="flex flex-col gap-3">
                        {results.map((ticket) => (
                            <li key={ticket.id} className="p-3 bg-gray-50 rounded-md border border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-900">{ticket.title}</p>
                                    <p className="text-sm text-gray-600">{ticket.description}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
                                        {/* Convert 0.85 to "85%" */}
                                        {Math.round(ticket.similarity * 100)}% Match
                                    </span>
                                    <span className="text-xs font-bold text-gray-500">{ticket.status}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => setResults(null)} 
                        className="mt-4 text-sm text-red-500 hover:text-red-700 font-semibold"
                    >
                        Clear Results
                    </button>
                </div>
            )}

            {/* If the AI returns an empty array */}
            {results && results.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                    No tickets matched that vibe. Try phrasing it differently!
                </div>
            )}
        </div>
    );
}