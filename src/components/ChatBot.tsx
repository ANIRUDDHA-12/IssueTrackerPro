"use client";

import { useState, useRef, useEffect } from "react";
import { projectManager } from "@/app/actions/ai"; // Adjust your import path

// Define the shape of a chat message
type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // Start with a friendly greeting
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "ai", content: "Hi! I'm your AI Project Manager. Ask me anything about the tickets on the board!" }
    ]);

    // Auto-scroll to the bottom when new messages arrive
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput(""); // Clear the input box instantly
        
        // 1. Add the user's message to the UI
        const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: userText };
        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);

        // 2. Call your RAG Brain!
        const res = await projectManager(userText);

        // 3. Add the AI's response to the UI
        const newAIMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            role: "ai", 
            content: res.success ? (res.answer || "I'm not sure how to answer that.") : "Sorry, my brain disconnected. Try again!" 
        };
        
        setMessages(prev => [...prev, newAIMsg]);
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* THE CHAT WINDOW (Only shows if isOpen is true) */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
                        <div>
                            <h3 className="font-bold text-sm">AI Project Manager</h3>
                            <p className="text-xs text-purple-200">Powered by RAG & Groq</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
                            ✕
                        </button>
                    </div>

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.role === "user" 
                                        ? "bg-purple-600 text-white rounded-tr-none" 
                                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        
                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-500 italic flex gap-1">
                                    <span className="animate-bounce">●</span>
                                    <span className="animate-bounce delay-100">●</span>
                                    <span className="animate-bounce delay-200">●</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about tickets..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:border-purple-500"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
                        >
                            ↗
                        </button>
                    </form>
                </div>
            )}

            {/* THE FLOATING ACTION BUTTON */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-purple-600 rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-transform hover:scale-105"
                >
                    {/* A simple chat icon using SVG */}
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}
        </div>
    );
}