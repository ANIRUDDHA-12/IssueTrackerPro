"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function addComment(issueId: string, content: string) {
    const supabase = await createClient()

    // 1. The Security Check
    const { data, error: authError } = await supabase.auth.getUser()
    if (authError || !data.user) {
        return { success: false, error: "Unauthorized" }
    }



    // 2. THE DATABASE INSERT (YOUR TURN)
    // You need to insert a new row into the 'comments' table.
    // Look at your SQL script above to see what columns are required.
    // You have three pieces of data ready to use: content, issueId, and data.user.id
    
    // const { error } = await supabase.from('comments').insert({ ... })

    const {error} = await supabase
    .from("comments")
    .insert({
        issue_id:issueId as string,
        content:content as string,
        user_id:data.user.id
    })

    const { data: comments } = await supabase
  .from('comments')
  .select('*, profiles(email)') // Get all comment data, PLUS the author's email!
  .eq('issue_id', issueId)
  .order('created_at', { ascending: true })

    // 3. Error Handling & Refresh
    if (error) {
        return { success: false, error: error.message }
    }
    
    revalidatePath("/dashboard")
    return { success: true }
}

  // The Server Action: I need you to write the Server Action function that the button will call. Assume you have a comments table with an upvotes (number) column. Write the function export async function incrementUpvote(commentId: string). (Hint: You just need to show me the Supabase update logic).

  