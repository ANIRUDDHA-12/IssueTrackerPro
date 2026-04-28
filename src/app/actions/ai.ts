"use server"

import Groq from "groq-sdk"
import {pipeline,env} from "@xenova/transformers"
import { searchIssues } from "./issues"
env.allowLocalModels= true
env.useBrowserCache=false

const globalForAI = globalThis as unknown as {
    embeddingPipeline?:any
}


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



export async function generateCordinates(text: string): Promise<number[] | null> {
    try {
        // The NEW Hugging Face Router API Endpoint for Feature Extraction
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: [text], // The new pipeline strictly requires an array
                    options: { wait_for_model: true }
                }),
            }
        );

        if (!response.ok) {
            console.error("HuggingFace API Error:", await response.text());
            return null;
        }

        const result = await response.json();
        
        // Safely extract the vector array depending on how HF parses it
        if (Array.isArray(result) && Array.isArray(result[0])) {
            return result[0] as number[];
        }
        
        return result as number[];

    } catch (error) {
        console.error("Failed to generate embedding via HuggingFace:", error);
        return null;
    }
}

export async function projectManager(userQuestion:string){
    try{
        console.log(`[RAG] 1 User asked the question :${userQuestion}`)
    const searchResults = await searchIssues(userQuestion)

    let contextText = "No relevant tickets found in the database.";
        
    if(searchResults && searchResults.length >0){
        console.log(`[RAG] 2. Found ${searchResults.length} relevant tickets.`);
        contextText = searchResults.map((ticket)=>`
            Ticket Title : ${ticket.title}
            Status:${ticket.status}
            Description:${ticket.description}
            Match Score:${Math.round(ticket.similarity*100)}%        
        `
        ).join("\n---\n")
    }else {
            console.log("[RAG] 2. No tickets matched the math.");
        }

      const systemPrompt = `
            You are a highly efficient Project Manager Assistant for an Issue Tracker.
            Your job is to answer the user's question based ONLY on the provided database tickets.
            
            Rules:
            1. Be concise, professional, and helpful.
            2. If the user asks about something that is NOT in the provided tickets, you MUST reply: "I'm sorry, I don't see any tickets related to that in the current database." Do not guess or make up features.
            3. Mention the specific ticket titles or statuses if it helps answer the question.
            
            DATABASE TICKETS:
            ${contextText}
        `;
        
      console.log("[RAG] 3. Sending Augmented Prompt to Groq...");
      
      const chatCompletetion = await groq.chat.completions.create({
        messages:[
            { role: "system", content: systemPrompt },
                { role: "user", content: userQuestion }
        ],
        model:"llama-3.1-8b-instant",
        temperature:0.3
      })
      const aiResponse = chatCompletetion.choices[0]?.message.content
      console.log("RAG 4.Response Recieved")
      
      return{success:true,answer:aiResponse}
    }catch (error) {
        console.error("RAG Pipeline Failed:", error);
        return { success: false, answer: "I'm having trouble connecting to the database brain right now. Please try again." };
    }
}


