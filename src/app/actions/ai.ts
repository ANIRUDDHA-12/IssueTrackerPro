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



export  async function generateCordinates(text:string): Promise<number[] | null>{
    try{
        // If the AI isn't in memory yet, download/load it!
        // We use 'all-MiniLM-L6-v2' because it natively outputs exactly 384 dimensions.
        if(!globalForAI.embeddingPipeline){
            console.log("Loading Neural Network Into Server RAM..")
            globalForAI.embeddingPipeline = await pipeline(
                'feature-extraction',
                'Xenova/all-MiniLM-L6-v2'
            )
            console.log("Loaded Sucessfully")
        }
        // Send the text into the AI
        const output = await globalForAI.embeddingPipeline(text, { 
            pooling: 'mean', 
            normalize: true 
        });

        const embeddingArray = Array.from(output.data) as number[]

        return embeddingArray
    }
    catch(error){
        console.error("Local AI Embedding Failed:", error);
        // Fallback to random math ONLY if the AI completely crashes
        return Array.from({ length: 384 }, () => Math.random() * 2 - 1);
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


