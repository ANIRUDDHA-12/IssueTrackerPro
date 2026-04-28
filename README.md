IssueTracker Pro


An enterprise-grade, AI-native project management platform built with Next.js and Supabase. It features a fully serverless AI architecture for semantic search, intelligent auto-tagging, an embedded RAG (Retrieval-Augmented Generation) chatbot, and real-time state management.

🚀 Key Features
AI-Powered Semantic Search & Duplicate Detection: Users can find tickets by meaning and "vibe," not just exact keywords. The platform calculates mathematical cosine similarity to warn users of semantically related tickets and duplicates directly on the Kanban board.

Serverless Vector Architecture: Extended PostgreSQL with pgvector to store 384-dimensional mathematical coordinates. Embedding generation is decoupled and offloaded to the Hugging Face Serverless Inference API (all-MiniLM-L6-v2), maintaining a near-zero MB server footprint for seamless Vercel deployment.

Groq-Powered RAG Chatbot: A built-in AI Project Manager that queries the PostgreSQL database in real-time, providing context-aware answers about team workload, ticket status, and project velocity.

Smart Auto-Tagging: Automatically categorizes new issues (Priority and Type) using an integrated LLM (Groq) during ticket creation.

Enterprise UI & Drag-and-Drop: A dynamic, premium three-column Kanban board built with @dnd-kit, styled with a strict B2B SaaS Global Design System using Tailwind CSS.

Authentication & Security: Secure email/password login and session management via Supabase Auth (using the Singleton pattern to prevent memory leaks), backed by bulletproof Row Level Security (RLS) policies.

🛠 Tech Stack
Framework: Next.js 15 (App Router)

Language: TypeScript

Styling: Tailwind CSS

Database: PostgreSQL & pgvector (via Supabase)

Authentication: Supabase Auth (@supabase/ssr)

AI & Machine Learning:

Hugging Face Router API (Sentence-Transformers Feature Extraction)

Groq API (LLM Auto-Tagging & RAG Chatbot)

State Management & UI: React Hooks (useState, useTransition), @dnd-kit/core

🏗 Architecture Highlights
Vercel-Optimized Serverless AI: Originally prototyped with local ONNX neural networks, the architecture was refactored to use Hugging Face's Router API. This decoupled the 90MB heavy ML weights from the Next.js Node environment, successfully bypassing Vercel's 50MB serverless function limits.

Database-Layer Filtering: Duplicate ticket detection logic is pushed down to the SQL layer via Supabase RPC functions, saving the Node server from expensive array filtering and reducing network payload sizes.

Secure Server Actions: All database mutations, SQL queries, and AI inferences bypass traditional API routes entirely, executing securely directly on the server via Next.js Server Actions.

💻 Getting Started
1. Clone the repository:

Bash
git clone https://github.com/ANIRUDDHA-12/IssueTrackerPro.git
cd IssueTrackerPro
2. Install dependencies:

Bash
npm install
3. Set up your environment variables: Create a .env.local file in the root directory and add your credentials:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_finegrained_token
(Note: Ensure your Hugging Face token has the "Make calls to the serverless Inference API" permission enabled).

4. Database Setup: Ensure you have enabled the vector extension in your Supabase SQL Editor and executed your match_issues RPC function for vector similarity search.

5. Run the development server:

Bash
npm run dev
Open http://localhost:3000 to view the application.