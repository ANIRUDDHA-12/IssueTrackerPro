import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";


export async function GET(request:Request) {
    const authHeader = request.headers.get("authorization")

    if(!authHeader){
        return NextResponse.json(
           { success:false},
            {status:401}
        )
    }

    const formatKey = "Bearer "+ process.env.DEVELOPER_API_KEY

    if(formatKey !== authHeader){
        return NextResponse.json(
            {error:"Invalid Api key"},
            {status:401}
        )
    }

    const supabaseAdmin =  createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: issues, error: dbError } = await supabaseAdmin
        .from("issues")
        .select("*");

    if (dbError) {
        return NextResponse.json(
            { success: false, error: "Database failed to load" }, 
            { status: 500 } 
        );
    }
    return NextResponse.json({ issues });
}

export async function POST(request: Request) {
    // 1. THE BOUNCER
    // (Copy and paste your exact authHeader and expectedKey checks here!)
     const authHeader = request.headers.get("authorization")

    if(!authHeader){
        return NextResponse.json({
            success:false,
            status:401
        })
    }

    const formatKey = "Bearer "+ process.env.DEVELOPER_API_KEY

    if(formatKey !== authHeader){
        return NextResponse.json(
            {error:"Invalid Api key"},
            {status:401}
        )
    }


    // 2. OPEN THE PACKAGE
    const body = await request.json();
    const { title, description } = body;

    // 3. VALIDATE
    if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // 4. THE VAULT (YOUR TURN)
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Write the Supabase insert query here. 
    // Remember to insert an object with the title, description, and maybe a default status like "OPEN".
    // ...
    const {data:userData,error:dbError} = await supabaseAdmin
    .from("issues")
    .insert({
        title:title as string,
        description:description as string,
        status:"OPEN",
        created_by: process.env.API_SYSTEM_USER_ID!
    })
    .select()

    if(dbError){
       return NextResponse.json(
            { success: false, error: dbError.message },
            {status:500}
        )
    }

    // 5. THE SUCCESS RESPONSE
    // Return a 201 status (which means "Created" in HTTP language!)
    return NextResponse.json(
        {userData},
        {status:201}
    )

}