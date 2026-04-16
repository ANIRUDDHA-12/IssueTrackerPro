"use client"
import { usePathname,useSearchParams,useRouter } from "next/navigation"

type Profile = {email:string,id:string}

export default function BoardFilters({profiles}:{profiles:Profile[]}){
    const searchParams  = useSearchParams()
    const pathname  = usePathname()
    const {replace} = useRouter()

    // the following function updates the url without reloading the page accordingly
    const handleFilter = (key:string,value:string)=>{
        //this takes the current url parameters
        const params = new URLSearchParams(searchParams)

        // set or delete the params on userInput
        if(value){
            params.set(key,value)
        }
        else{
            params.delete(value)
        }

        // replace the url with the following query that may be any likewise
        replace(`${pathname}?${params.toString()}`)
    }
    return (
    <div className="mb-6 flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
      
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search issues by title..."
          // Set the default value to whatever is currently in the URL
          defaultValue={searchParams.get("query")?.toString()}
          // Update the URL when they type
          onChange={(e) => handleFilter("query", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Assignee Filter Dropdown */}
      <div>
        <select
          defaultValue={searchParams.get("assignee")?.toString() || ""}
          onChange={(e) => handleFilter("assignee", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Assignees</option>
          <option value="UNASSIGNED">Unassigned</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.email}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}