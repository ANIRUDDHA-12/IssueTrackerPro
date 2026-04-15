# IssueTracker Pro

A modern, full-stack Jira clone built with Next.js App Router and Supabase. This application features a real-time Kanban board, secure authentication, and robust row-level security.

## 🚀 Features

* **Authentication:** Secure email/password login and session management via Supabase Auth.
* **Kanban Dashboard:** Dynamic, three-column board (To Do, In Progress, Done) for visualizing project state.
* **Full CRUD Operations:** Create, Read, Update, and Delete issues using Next.js Server Actions.
* **Team Assignment:** Assign tickets to registered team members. Powered by PostgreSQL database triggers and relational joins.
* **Optimistic UI:** Smooth status updates and deletions using React `useTransition` and background path revalidation.
* **Bulletproof Security:** Deeply integrated Row Level Security (RLS) policies ensuring users can only mutate data they own.

## 🛠 Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database:** PostgreSQL (via Supabase)
* **Authentication:** Supabase Auth
* **State Management:** React Hooks (`useState`, `useTransition`)

## 🏗 Architecture Highlights

* **Server Actions:** All database mutations bypass API routes entirely, securely executing directly on the server.
* **PostgreSQL Triggers:** A custom trigger automatically mirrors secure `auth.users` data into a public `profiles` table upon signup for relational queries.
* **Client vs. Server Components:** Interactivity is pushed to the "leaves" of the component tree (modals, dropdowns, buttons) while the core dashboard remains a fast Server Component.

## 💻 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ANIRUDDHA-12/IssueTrackerPro.git
    cd issuetracker-pro
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.