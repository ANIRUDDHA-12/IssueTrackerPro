"use client"

import { useDroppable } from "@dnd-kit/core"

export default function KanbanColumn(
    {
        id,
        title,
        count,
        children
    }:{
        id:string,
        title:string,
        count:number,
        children:React.ReactNode
    }
){
    const {setNodeRef}=useDroppable({id:id})
    return(
        <div ref={setNodeRef} className="flex flex-col space-y-4 rounded-xl bg-slate-100/50 p-3">
            {/* 2. The Header Area */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h2>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600">{count}</span>
      </div>

      {/* 3. The Empty Space for the cards */}
      <div className="flex flex-col space-y-4">
        {children}
      </div>
        </div>
    )
}

