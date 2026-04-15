"use server"

import { createClient } from "../../utils/supabase/server"
import { redirect } from "next/navigation"

export async function loginUser(email:string,password:string){
    const supabase = await createClient()

    const {error}=await supabase.auth.signInWithPassword({email,password})

    if(error){
        return{success:false,error:error.message}
    }
    redirect("/dashboard")
}

export async function signUpUser(email:string,password:string){

    const supabase = await createClient()

    const {error}= await supabase.auth.signUp({email,password})

    if(error){
        return({succes:false,error:error.message})
    }

    redirect("/dashboard")
}

export async function logoutUser(){
    const supabase = await createClient()

    const {error}= await supabase.auth.signOut()

    if(error){
        return({sucess:false,error:error.message})
    }
    redirect("/login")
}