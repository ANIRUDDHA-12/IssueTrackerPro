"use client"
import StatusDropdown from "./StatusDropdown";
import DeleteIssueButton from "./DeleteIssueButton";
import AssigneeDropdown from "./AssigneeDropdown";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { usePathname,useSearchParams,useRouter } from "next/navigation"
import { getNearIssues } from "@/app/actions/issues";
import { useState } from "react";

// We define the shape of the data so TypeScript can catch our typos
type Issue = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  assigned_to:string | null
};

type Profile = { id: string; email: string; };

export default function IssueCard({ issue,profiles }: { issue: Issue,profiles:Profile[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
const [isLoadingRelated, setIsLoadingRelated] = useState(false);
const [relatedTickets, setRelatedTickets] = useState<{ id: string; title: string; similarity: number }[]>([]);
   const searchParams = useSearchParams()
    const pathname = usePathname()
    const{replace}=useRouter()
  const{setNodeRef,listeners,attributes,transform} = useDraggable({
    id:issue.id,
    data:{...issue}
  })

  function handleOpenModal(e:React.MouseEvent<HTMLHeadElement>){
    e.stopPropagation()
    const params=new URLSearchParams(searchParams)
    params.set("selectedIssue",issue.id)


    replace(`${pathname}?${params.toString()}`)
}

const handleFindRelated = async (e: React.MouseEvent) => {
    // Prevent the click from triggering drag-and-drop or opening the card
    e.stopPropagation(); 
    
    // If it's already open, just close it
    if (isExpanded) {
        setIsExpanded(false);
        return;
    }

    // Open it and show the loading state
    setIsExpanded(true);
    setIsLoadingRelated(true);

    try {
        // Call your backend AI function
        const results = await getNearIssues(issue.id, issue.title, issue.description);
        
        if (results) {
            setRelatedTickets(results);
        }
    } catch (error) {
        console.error("Vector search failed:", error);
    } finally {
        setIsLoadingRelated(false);
    }
};
  const style = {
    // CSS.Translate.toString() converts the X/Y numbers into "translate3d(x, y, z)"
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-slate-500">
            {issue.type}
          </span>
          <StatusDropdown issueId={issue.id} currentStatus={issue.status} />
        </div>
        
        <h3 className="mb-1 text-lg font-bold text-slate-900 cursor-pointer hover:text-blue-600 hover:underline" onPointerDown={(e)=>{handleOpenModal(e)}}>{issue.title}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-slate-500">{issue.description}</p>
        
        {/* The New Assignee Dropdown! */}
        <div className="flex items-center space-x-2">
           <span className="text-xs text-slate-500">Assignee:</span>
           <AssigneeDropdown issueId={issue.id} currentAssigneeId={issue.assigned_to} profiles={profiles} />
        </div>
      </div>

      {/* --- THE MERGED FOOTER --- */}
<div className="mt-4 flex items-center justify-between border-t pt-4 border-gray-200">
    <span className={`text-xs font-bold ${
        issue.priority === 'CRITICAL' ? 'text-red-600' : 
        issue.priority === 'HIGH' ? 'text-orange-500' : 
        'text-slate-500'
    }`}>
        {issue.priority} PRIORITY
    </span>
    
    <div className="flex items-center gap-4">
        <button
            onPointerDown={handleFindRelated}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
        >
            ✨ AI Related {isExpanded ? '▲' : '▼'}
        </button>
        <DeleteIssueButton issueId={issue.id} />
    </div>
</div>

{/* The Expandable Panel stays exactly the same below this! */}

{/* 2. The Expandable Panel */}
{isExpanded && (
    <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100 transition-all">
        <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-2">
            Semantically Similar Issues
        </h4>
        
        {isLoadingRelated ? (
            <div className="text-xs text-indigo-400 flex items-center gap-2 font-medium">
                <span className="animate-pulse text-indigo-600">●</span> Searching vector database...
            </div>
        ) : relatedTickets.length > 0 ? (
            <ul className="space-y-2">
                {relatedTickets.map((ticket, idx) => (
                    <li key={idx} className="flex flex-col">
                        <span className="text-xs font-medium text-slate-800 truncate">
                            {ticket.title}
                        </span>
                        <span className="text-[10px] text-slate-500">
                            {Math.round(ticket.similarity * 100)}% mathematical match
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="text-xs text-slate-500 italic">No highly similar issues found.</div>
        )}
    </div>
)}
      </div>
  );
}




