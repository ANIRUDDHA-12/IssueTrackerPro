"use client"

"use client"

import { useState } from "react"
import { addComment } from "@/app/actions/comments"
import toast, { Toast } from "react-hot-toast"

type Comment = {
  id: string
  content: string
  created_at: string
  profiles: { email: string } // Notice how perfectly Supabase types relational data!
}

export default function CommentsSection({ 
  issueId, 
  initialComments 
}: { 
  issueId: string
  initialComments: Comment[] 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    // 1. Grab the form data
    const formData = new FormData(e.currentTarget)
    const content = formData.get("content") as string
    
    if (!content) {
        setIsSubmitting(false)
        return
    }

    // 2. THE ACTION CALL (YOUR TURN)
    // How do you call the addComment server action you just wrote?
    // What do you do if it fails? What do you do if it succeeds?

    const result = await addComment(issueId,content)

    if(result?.error){
        toast.error(result.error)
    }
    else{
        toast.success("comment posted")
    }

    // 3. Reset the form
    ;(e.target as HTMLFormElement).reset()
    setIsSubmitting(false)
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Discussion</h3>
      
      {/* The Comment List */}
      <div className="space-y-4 mb-6">
        {initialComments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet. Start the conversation!</p>
        ) : (
          initialComments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">{comment.profiles?.email}</span>
                <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {/* The Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="content"
          placeholder="Add a comment..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Comment"}
        </button>
      </form>
    </div>
  )
}