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
        <div ref={setNodeRef} className="flex flex-col space-y-4 rounded-xl bg-gray-100 p-4">
            {/* 2. The Header Area */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">{title}</h2>
        <span className="rounded-full bg-gray-300 px-2 py-0.5 text-xs font-bold text-gray-700">{count}</span>
      </div>

      {/* 3. The Empty Space for the cards */}
      <div className="flex flex-col space-y-4">
        {children}
      </div>
        </div>
    )
}

