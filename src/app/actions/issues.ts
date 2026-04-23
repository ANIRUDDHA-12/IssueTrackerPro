"use server"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { resend } from "@/utils/resend"
import { autoTagIssue } from "./ai"

export type CreateIssueResult = {success:boolean,error?:string}

export async function createIssue(formData:FormData){
    const title = formData.get('title') as string
    const description = formData.get('description') as string
     const aiResponse = await autoTagIssue(title,description)

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