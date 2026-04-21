"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI= new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
export interface AITags {
    priority:string,
    type:string
}

export async function autoTagIssue(title:string,description:string): Promise<AITags | null>{
    const model = genAI.getGenerativeModel({
        model:"gemini-2.5-flash",
        generationConfig:{
            responseMimeType: "application/json",
        }
    })

    const prompt = `
        You are an expert agile project manager analyzing a new Kanban board ticket.
        Determine the most logical priority and type for this ticket based on the text.

        Ticket title:${title}
        Ticket description:${description}

        Return EXACTLY this JSON structure, and nothing else:
        {
            "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
            "type": "BUG" | "FEATURE" | "CHORE"
        }
    `

    try{
        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        const aiTags = JSON.parse(responseText) as AITags

        console.log("Ai Sucessfully Tagged",aiTags)
        return aiTags
    }
    catch(error){
        console.error("AI Auto-Tagger Failed:", error);
        return null; 
    }
}

