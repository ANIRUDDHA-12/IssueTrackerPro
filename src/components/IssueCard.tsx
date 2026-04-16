"use client"
import StatusDropdown from "./StatusDropdown";
import DeleteIssueButton from "./DeleteIssueButton";
import AssigneeDropdown from "./AssigneeDropdown";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

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
  const{setNodeRef,listeners,attributes,transform} = useDraggable({
    id:issue.id,
    data:{...issue}
  })

  const style = {
    // CSS.Translate.toString() converts the X/Y numbers into "translate3d(x, y, z)"
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
            {issue.type}
          </span>
          <StatusDropdown issueId={issue.id} currentStatus={issue.status} />
        </div>
        
        <h3 className="mb-1 text-lg font-bold text-gray-900">{issue.title}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-500">{issue.description}</p>
        
        {/* The New Assignee Dropdown! */}
        <div className="flex items-center space-x-2">
           <span className="text-xs text-gray-400">Assignee:</span>
           <AssigneeDropdown issueId={issue.id} currentAssigneeId={issue.assigned_to} profiles={profiles} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <span className={`text-xs font-bold ${
          issue.priority === 'CRITICAL' ? 'text-red-600' : 
          issue.priority === 'HIGH' ? 'text-orange-500' : 
          'text-gray-500'
        }`}>
          {issue.priority} PRIORITY
        </span>
        
        {/* Your interactive delete button! */}
        <DeleteIssueButton issueId={issue.id} />
      </div>
    </div>
  );
}