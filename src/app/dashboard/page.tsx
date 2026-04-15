
import { createClient } from "@/utils/supabase/server";
import { logoutUser } from "../actions/auth"
import CreateIssueModal from "@/components/CreateIssueModal"
import StatusDropdown from "@/components/StatusDropdown";
import DeleteIssueButton from "@/components/DeleteIssueButton";
import IssueCard from "@/components/IssueCard";

export default async function DashboardPage() {

  const supabase = await createClient()

  const {data:issues,error}= await supabase
  .from("issues")
  .select("*")
  .order("created_at", { ascending: false })

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*");

  // 2. The Data Sort (Filtering)
  //  safely default to empty arrays [] if 'issues' comes back null
  const openIssues= issues?.filter((i)=>i.status==="OPEN") || []
  const inProgressIssues = issues?.filter((i) => i.status === "IN_PROGRESS" || i.status === "IN_REVIEW") || [];
  const doneIssues = issues?.filter((i) => i.status === "DONE") || [];


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Bar */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">IssueTracker Pro</h1>
          
          <div className="flex space-x-4">
            <CreateIssueModal />
            <form onSubmit={logoutUser}>
              <button 
                type="submit"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded border border-red-200 bg-red-50 p-4 text-red-600">
            Error loading issues: {error.message}
          </div>
        )}

        {/* 3. The Kanban Grid Layout */}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          
          {/* Column 1: TO DO */}
          <div className="flex flex-col space-y-4 rounded-xl bg-gray-200/50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">To Do</h2>
              <span className="rounded-full bg-gray-300 px-2 py-0.5 text-xs font-bold text-gray-700">{openIssues.length}</span>
            </div>
            {openIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} profiles={profiles || []} />
            ))}
          </div>

          {/* Column 2: IN PROGRESS */}
          <div className="flex flex-col space-y-4 rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-800">In Progress</h2>
              <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-bold text-blue-800">{inProgressIssues.length}</span>
            </div>
            {inProgressIssues.map((issue) => (
             <IssueCard key={issue.id} issue={issue} profiles={profiles || []} />
            ))}
          </div>

          {/* Column 3: DONE */}
          <div className="flex flex-col space-y-4 rounded-xl bg-green-50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-green-800">Done</h2>
              <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-bold text-green-800">{doneIssues.length}</span>
            </div>
            {doneIssues.map((issue) => (
             <IssueCard key={issue.id} issue={issue} profiles={profiles || []} />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}