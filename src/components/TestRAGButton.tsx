"use client"; // This file is the Island!

import { useState } from "react";
import { projectManager } from "@/app/actions/ai"; 

export default function TestRAGButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleTest = async () => {
        setIsLoading(true);
        // Call the Server Action
        const res = await projectManager("Are there any bugs related to logging in?");
        console.log("RAG ANSWER:", res.answer);
        alert(res.answer);
        setIsLoading(false);
    };

    return (
        <button 
            onClick={handleTest}
            disabled={isLoading}
            className="bg-purple-600 text-white font-bold p-3 rounded hover:bg-purple-700 disabled:opacity-50"
        >
            {isLoading ? "Thinking..." : "Test RAG Brain"}
        </button>
    );
}