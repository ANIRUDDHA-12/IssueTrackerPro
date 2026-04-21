"use client"

import { DndContext,DragEndEvent } from "@dnd-kit/core";
import IssueCard from "./IssueCard"
import { useState,useEffect } from "react"
import KanbanColumn from "./KanbanColumn"
import { updateIssue } from "@/app/actions/issues";
import { createClient } from "@/utils/supabase/client";
import { patchFetch } from "next/dist/server/app-render/entry-base";



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
  // 1. Add the mounted state
  const[isMounted,setIsMounted]=useState(false)
    //  put the issues in React State so we can update them instantly when dragged
  const [issues, setIssues] = useState<Issue[]>(initialIssues);

  useEffect(()=>{
    setIsMounted(true)
  },[])

  useEffect(()=>{
    let supabaseClient:any
    let channel:any

    const setUpRadio = async ()=>{
       supabaseClient = await createClient()

      channel = supabaseClient
        .channel('issues-sync')
        .on(
          `postgres_changes`,
          {event:'*',schema:'public',table:'issues'},
          (payload:any)=>{
            console.log("Radio signal reached",payload);

           if (payload.eventType === 'UPDATE') {
                        setIssues((currentIssuesState) => {
                            return currentIssuesState.map((currentIssue) => {
                                if (currentIssue.id === payload.new.id) {
                                    return payload.new as Issue; 
                                } else {
                                    return currentIssue;
                                }
                            });
                        });
                      }
            if (payload.eventType === 'INSERT') {
    setIssues((currentIssueState) => {
        // 1. Check if the ticket is already in our React state
        const ticketAlreadyExists = currentIssueState.some(
            (issue) => issue.id === payload.new.id
        );

        // 2. If Next.js already fetched it, ignore the radio signal!
        if (ticketAlreadyExists) {
            return currentIssueState; 
        }

        // 3. If it's genuinely a new ticket (e.g. from another user's screen), add it!
        return [
            ...currentIssueState,
            payload.new
        ];
    });
}
            if(payload.eventType === 'DELETE'){
              setIssues((currentIssueState)=>currentIssueState.filter((remove)=>remove.id !==payload.old.id)
              )
            }       
          }
        ).subscribe()

    }
    setUpRadio();

    return ()=>{
      if(supabaseClient && channel){
        supabaseClient.removeChannel(channel)
      }
    }
  },[])



  // 3. If the browser hasn't taken over yet, render an empty skeleton or null.
  // This guarantees the server render perfectly matches the initial client render.
  if (!isMounted) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">Loading board...</p>
      </div>
    );
  }
  

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

