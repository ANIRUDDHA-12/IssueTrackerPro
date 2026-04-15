"use client"
import { useTransition } from "react"
import { deleteIssue } from "@/app/actions/issues"

export  default  function DeleteIssueButton({issueId}:{issueId:string}){
    const [isPending,startTransition]= useTransition()

    const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this issue? This cannot be undone.")) {
      startTransition(async () => {
        // We capture the result of the server action this time
        const result = await deleteIssue(issueId);
        
        // If the server action returns an error, we show it to the user!
        if (result && !result.success) {
          alert(`Failed to delete: ${result.error}`);
        }
      });
    }
  };

    return(
        <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  )
    
}