
import { createClient } from "@/utils/supabase/server";
import { logoutUser } from "../actions/auth"
import CreateIssueModal from "@/components/CreateIssueModal"
import StatusDropdown from "@/components/StatusDropdown";
import DeleteIssueButton from "@/components/DeleteIssueButton";
import IssueCard from "@/components/IssueCard";
import BoardFilters from "@/components/BoardFilters";
import KanbanBoard from "@/components/KanbanBoard";
import Comments from "@/components/Comments";
import { searchIssues } from "../actions/issues";
import SearchBox from "@/components/SearchBox";
// import { backfillOldTickets } from "../actions/issues";

type SearchParams = Promise<{[key:string]:string | undefined}> 

export default async function DashboardPage(props:{searchParams:SearchParams}) {
  // Await the searchParams promise (Next.js 15 requirement)
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const assignee = searchParams?.assignee || "";
  const selectedIssueId = searchParams?.selectedIssue || null;

  // TEMPORARY TEST CODE
const testResults = await searchIssues("login");
console.log("SEMANTIC SEARCH RESULTS:", testResults);

  const supabase = await createClient()

  let dbQuery = supabase
    .from("issues")
    .select(`
      *,
      comments (
        id,
        content,
        created_at,
        profiles (email)
      )
    `)
    .order("created_at",{ascending:false})

    // 2. If there is a search term in the URL, filter titles using 'ilike' (case-insensitive match)
  if (query) {
    dbQuery = dbQuery.ilike("title", `%${query}%`);
  }

  // 3. If there is an assignee in the URL, filter exactly
  if (assignee) {
    if (assignee === "UNASSIGNED") {
      dbQuery = dbQuery.is("assigned_to", null);
    } else {
      dbQuery = dbQuery.eq("assigned_to", assignee);
    }
  }

  // 4. Execute the query
  const { data: issues, error } = await dbQuery;


  const { data: profiles } = await supabase
    .from("profiles")
    .select("*");

    const selectedIssueData = selectedIssueId 
    ? issues?.find((issue) => issue.id === selectedIssueId) 
    : null;

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
            <form action={logoutUser}>
              <button 
                type="submit"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>

         {/* <BoardFilters profiles={profiles || []} />  */}
        {error && (
          <div className="mb-8 rounded border border-red-200 bg-red-50 p-4 text-red-600">
            Error loading issues: {error.message}
          </div>
        )}
        <SearchBox />

        <KanbanBoard initialIssues={issues || []} profiles={profiles || []} />

        {/* THE NEW ISSUE DETAILS MODAL OVERLAY */}
        {selectedIssueData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
               
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedIssueData.title}</h2>
                  
                  {/* The Close Button! */}
                  <a 
                    href="/dashboard" 
                    className="text-gray-400 hover:text-gray-800 font-medium"
                  >
                    Close
                  </a>
               </div>
               
               <p className="text-gray-600 mb-6">{selectedIssueData.description}</p>
               
               {/* THE COMMENTS COMPONENT! */}
               <Comments 
                  issueId={selectedIssueData.id} 
                  initialComments={selectedIssueData.comments || []} 
               />
               
            </div>
          </div>
        )}

      </div>
    </div>
  );
}