"use client"

import { DndContext,DragEndEvent } from "@dnd-kit/core";
import IssueCard from "./IssueCard"
import { useState } from "react"
import KanbanColumn from "./KanbanColumn"
import { updateIssue } from "@/app/actions/issues";


// We define the shape of the data so TypeScript can catch our typos
type Issue = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  assigned_to:string | null
}

type Profile = {email:string,id:string}

export default function KanbanBoard({
    initialIssues,
    profiles
}:{
initialIssues:Issue[],
profiles:Profile[]
})
{
    //  put the issues in React State so we can update them instantly when dragged
  const [issues, setIssues] = useState<Issue[]>(initialIssues);

    // safely default to empty array if no array there
    const openIssues= issues?.filter((i)=>i.status==="OPEN") || []
  const inProgressIssues = issues?.filter((i) => i.status === "IN_PROGRESS" || i.status === "IN_REVIEW") || [];
  const doneIssues = issues?.filter((i) => i.status === "DONE") || [];

  // The Referee: This runs the exact millisecond you let go of the mouse
  async function handleDragEnd(event:DragEndEvent){
    const{active,over} = event

    // if dragged and dropped outside the box ,do nothing
    if(!over) return

    const issueId= active.id as string
    const newStatus = over.id as string

    const draggedIssue = issues.find((issue)=>issue.id === issueId)

    console.log("You've picked up the id card:",active.id)
    console.log("You dropped it in column:",over?.id)

    if (!draggedIssue || draggedIssue.status === newStatus) return;

    // 3. THE OPTIMISTIC UI UPDATE (YOUR TURN)
    // We need to instantly update the 'issues' array in React State so the card moves on screen.
    // Use setIssues() to map over the existing issues. 
    // If the issue.id matches the dragged issueId, change its status to newStatus.
    
    // YOUR CODE GOES HERE:
    // setIssues((currentIssues) => ... );

    // 3. THE OPTIMISTIC UI UPDATE
    setIssues((currentIssues) => 
      currentIssues.map((issue) => 
        issue.id === issueId 
          ? { ...issue, status: newStatus } // Match found! Copy the issue, change status
          : issue                           // No match. Leave it exactly as is.
      )
    );


    // 4. The Background Database Save
    // The UI already updated instantly, now we quietly save it to Supabase
    const result = await updateIssue(issueId, newStatus);
    
    if (result && !result.success) {
      // If the database fails (e.g., they lost internet), we should ideally revert the UI,
      // but for now, we will just alert them.
      alert(`Failed to save: ${result.error}`);
    }
  }
  return(
    <DndContext onDragEnd={handleDragEnd}>
        {/* 3. The Kanban Grid Layout */}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">

          {/* Column 1: TO DO */}
        <KanbanColumn id="OPEN" title="To Do" count={openIssues.length}>
          {openIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} profiles={profiles || []} />
          ))}
        </KanbanColumn>
          
          

          {/* Column 2: IN PROGRESS */}
        <KanbanColumn id="IN_PROGRESS" title="In Progress" count={inProgressIssues.length}>
          {inProgressIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} profiles={profiles || []} />
          ))}
        </KanbanColumn>

          {/* Column 3: DONE */}
        <KanbanColumn id="DONE" title="Done" count={doneIssues.length}>
          {doneIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} profiles={profiles || []} />
          ))}
        </KanbanColumn>

        </div>
    </DndContext>
  )
}

