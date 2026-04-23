"use server"

import Groq from "groq-sdk"


export interface AITags {
    priority:string,
    type:string
}

const groq = new Groq({
    apiKey:process.env.GROQ_API_KEY
})

export async function autoTagIssue(title:string,description:string): Promise<AITags | null>{
   
    const systemPrompt = `
        You are an expert agile project manager analyzing a new Kanban board ticket.
        Determine the most logical priority and type for this ticket based on the text.
        
        Return EXACTLY this JSON structure, and nothing else:
        {
            "priority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            "type": "BUG" | "FEATURE" | "TASK"
        }
    `;

    try{
       const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {role:"system",content: systemPrompt},
            {role: "user", content: `Title: "${title}"\nDescription: "${description}"`}
        ],
        response_format:{type:"json_object"}
       })
       const responseText= response.choices[0]?.message?.content || "{}"
       const aiTags = JSON.parse(responseText) as AITags;
        
        console.log("Groq Successfully Tagged:", aiTags);
        return aiTags;
    }
    catch(error){
        console.error("AI Auto-Tagger Failed:", error);
        return null; 
    }
}

