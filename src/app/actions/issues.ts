"use server"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { resend } from "@/utils/resend"

export type CreateIssueResult = {success:boolean,error?:string}

export async function createIssue(formData:FormData){
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string
    const type = formData.get('type') as string

    const supabase = await createClient()
    const {data,error:authError} = await supabase.auth.getUser()

    if(authError || !data.user){
        throw new Error('User not authenticated')
    }

    const { error}= await supabase.from('issues').insert({
        title: title as string,
        description: description as string,
        priority: priority as string,
        type: type as string,
        created_by: data.user.id,
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
        revalidatePath("/dashboard")
    return {success:true}
}

export async function deleteIssue(issueId:string){
    const supabase = await createClient()

    const {data,error:authError}  = await supabase.auth.getUser()

    if(authError || !data.user){
        return({success:false,error:"Unauthorized"})
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

    try{
        await resend.emails.send({
            from:"Issues Tracker <onboarding@resend.dev>",
            to:"",
            subject:"New Assignment",
            html:"<p>Hello you've been assigned a new issue likewise.</p>"
        })
    }catch(emailError){
        console.error("Resend error:", emailError)
    }
    // 3. The Refresh
    revalidatePath("/dashboard");
    return { success: true };


}