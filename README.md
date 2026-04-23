# IssueTracker Pro

**An enterprise-grade, AI-native project management platform built with Next.js and Supabase. It features embedded local neural networks for semantic search, intelligent auto-tagging, and real-time state management.**

## 🚀 What We Have Built So Far

* **AI-Powered Semantic Search:** Users can find tickets by meaning and "vibe," not just exact keywords. This is powered by a local ONNX neural network running directly inside the Next.js server RAM.
* **Smart Auto-Tagging:** Automatically categorizes new issues (Priority and Type) using an integrated LLM (Groq) during ticket creation.
* **Vector Database Architecture:** Extended PostgreSQL with `pgvector` to store 384-dimensional mathematical coordinates for every ticket, enabling high-speed Cosine Similarity geometry calculations.
* **Data Migration Pipeline:** Engineered custom backfill scripts to retroactively embed and map legacy database rows into the new vector space.
* **Authentication & Security:** Secure email/password login and session management via Supabase Auth, backed by bulletproof Row Level Security (RLS) policies.
* **Interactive Kanban Dashboard:** Dynamic, three-column board (To Do, In Progress, Done) with full CRUD operations via secure Next.js Server Actions.
* **Optimistic UI:** Smooth status updates and interactions using React `useTransition` and background path revalidation.

## 🛠 Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database:** PostgreSQL & `pgvector` (via Supabase)
* **Authentication:** Supabase Auth
* **AI & Machine Learning:**
  * `@xenova/transformers` (Local Neural Network inference via `onnxruntime-node`)
  * Groq API (LLM Auto-Tagging)
* **State Management:** React Hooks (`useState`, `useTransition`)

## 🏗 Architecture Highlights

* **Server-Side AI Inference:** Next.js Server Actions are explicitly configured to bypass standard Webpack restrictions, allowing a C++ AI engine to run locally without relying on third-party API latency.
* **Server Actions:** All database mutations, SQL queries, and AI inferences bypass traditional API routes entirely, executing securely directly on the server.
* **Client vs. Server Components:** Interactivity (like the Semantic Search dispatcher) is pushed to the "leaves" of the component tree, while the core dashboard remains a highly performant Server Component.

## 💻 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ANIRUDDHA-12/IssueTrackerPro.git](https://github.com/ANIRUDDHA-12/IssueTrackerPro.git)
    cd issuetracker-pro
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env.local` file in the root directory and add your credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    GROQ_API_KEY=your_groq_api_key
    ```

4.  **Database Setup:**
    Ensure you have enabled the `vector` extension in your Supabase SQL Editor and executed the `match_issues` RPC function.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application. *(Note: The first time you run a semantic search, the server will briefly pause to download the local AI model).*