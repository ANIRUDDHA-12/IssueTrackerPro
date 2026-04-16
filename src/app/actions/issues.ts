"use server"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

    // 1. The Bouncer
    const { data, error: authError } = await supabase.auth.getUser();
    if (authError || !data.user) {
        return { success: false, error: "Unauthorized" };
    }

    // 2. The Database Update
    const { error } = await supabase
        .from("issues")
        .update({ assigned_to: assigneeId })
        .eq("id", issueId);

    if (error) {
        return { success: false, error: error.message };
    }

    // 3. The Refresh
    revalidatePath("/dashboard");
    return { success: true };
}