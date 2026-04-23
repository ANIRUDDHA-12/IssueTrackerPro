"use server"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { resend } from "@/utils/resend"
import { autoTagIssue } from "./ai"
import {generateCordinates} from "./ai"

export type CreateIssueResult = {success:boolean,error?:string}

export async function createIssue(formData:FormData){
    const title = formData.get('title') as string
    const description = formData.get('description') as string
     const aiResponse = await autoTagIssue(title,description)

     const embedText = title + ":" + description
      const embeddingCoordinates = await generateCordinates(embedText)

     const finalPriority = aiResponse?.priority || "LOW";
    const finalType = aiResponse?.type || "TASK";
    // const priority = formData.get('priority') as string
    // const type = formData.get('type') as string

    const supabase = await createClient()
    const {data,error:authError} = await supabase.auth.getUser()

    if(authError || !data.user){
        throw new Error('User not authenticated')
    }

    const { error}= await supabase.from('issues').insert({
        title: title as string,
        description: description as string,
        priority: finalPriority as string,
        type: finalType as string,
        created_by: data.user.id,
        embedding:embeddingCoordinates
    })
    if(error){
    return({success:false,error:error.message})

    }
    revalidatePath("/dashboard")

    return{success:true}
}

export async function updateIssue(issueId:string,newStatus:string){
    const supabase = await createClient()

    const{data,error:authError} = await supabase.auth.getUser()
    if(authError || !data.user){
        return ({success:false,error:"Unauthorized"})
    }

    const {error}= await supabase
    .from("issues")
    .update({status:newStatus})
    .eq("id",issueId)

    if(error){
        return({success:false,error:error.message})
    }

    if(newStatus === "DONE"){
        const message = {
            content: `TASK COMPLETED TICKET ${issueId} WAS JUST MOVED TO DONE`
        }
        try{
            await fetch(process.env.DISCORD_WEBHOOK_URL!,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(message),
            })
        }catch(error){
            console.log("Failed to ping discord",error)
        }
    }
        revalidatePath("/dashboard")
    return {success:true}
}

export async function deleteIssue(issueId:string){
    const supabase = await createClient()

    const {data,error:authError}  = await supabase.auth.getUser()

    if(authError || !data.user){
        return({success:false,error:"Unauthorized"})
    }

    const {data:adminData,error:adminError} = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id",data.user.id)
    .single()

    console.log("BOUNCER DATA:", adminData, "BOUNCER ERROR:", adminError)
    if (adminError || !adminData) {
        return { success: false, error: "Access Denied: Admins Only" };
    }

    const {error} = await supabase
    .from("issues")
    .delete()
    .eq("id",issueId)

    if(error){
        return({success:false,error:error.message})
    }
    
    revalidatePath("/dashboard")
    return{success:true}
}

export async function updateIssueAssignee(issueId: string, assigneeId: string | null) {
    const supabase = await createClient();


    const { data, error: authError } = await supabase.auth.getUser();
    if (authError || !data.user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("issues")
        .update({ assigned_to: assigneeId })
        .eq("id", issueId);  

    if (error) {
        return { success: false, error: error.message };
    }



    const {data:profile,error:profileError} = await supabase
        .from("profiles")
        .select("email")
        .eq("id",assigneeId)
        .single()
    
        if (profileError) {
    console.error("Could not fetch profile for email notification.")
  }

    // try{
    //     await resend.emails.send({
    //         from:"Issues Tracker <onboarding@resend.dev>",
    //         to:"",
    //         subject:"New Assignment",
    //         html:"<p>Hello you've been assigned a new issue likewise.</p>"
    //     })
    // }catch(emailError){
    //     console.error("Resend error:", emailError)
    // }
    // 3. The Refresh
    revalidatePath("/dashboard");
    return { success: true };
}

export interface SearchResult{
    id:string,
    title:string,
    description:string,
    priority:string,
    status:string,
    similarity:number
}

export async function searchIssues(seearchQuery:string):Promise<SearchResult [] | null>{
    const supabase = await createClient()

    try{
        const queryCoordinates = await generateCordinates(seearchQuery)

        const {data,error} = await supabase.rpc('match_issues',{
            query_embedding:queryCoordinates,
            match_threshold: -0.1,
            match_count: 5
        })
        if(error){
            console.error("semantic search failed",error)
            return null
        }
        return data as SearchResult[]
    }catch(error){
        console.error("Semantic Search Crashed:", error);
        return null
    }
}   



export async function backfillOldTickets() {
    const supabase = await createClient();

    // STEP 1: Fetch the Ghosts
    // Write a Supabase query to SELECT all columns FROM "issues" 
    // WHERE the "embedding" column IS null.
    const { data: oldTickets, error: fetchError } = await supabase
    .from("issues")
    .select("*")
    .is("embedding",null)

    if (fetchError || !oldTickets) return { success: false, error: "Failed to fetch" };
    if (oldTickets.length === 0) return { success: true, message: "No old tickets found!" };

    // STEP 2: The Loop
    for (const ticket of oldTickets) {
        
        // STEP 3: The Translation
        const textToEmbed = ticket.title + " : " + ticket.description;
        const coordinates = await generateCordinates(textToEmbed); // Wait for the AI!

        // STEP 4: The Precision Update
        // Write a Supabase query to UPDATE the "issues" table.
        // Set the { embedding: coordinates }.
        // Make sure you use .eq("id", ticket.id) so you don't overwrite everything!
        const { error: updateError } = await supabase
        .from("issues")
        .update({embedding:coordinates})
        .eq("id",ticket.id)

        if (updateError) {
            console.error(`Failed to update ticket ${ticket.id}`);
        } else {
            console.log(`Successfully embedded ticket: ${ticket.title}`);
        }
    }

    return { success: true, message: "Backfill Complete!" };
}