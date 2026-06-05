# 🚀 IssueTracker Pro - Comprehensive Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Database Schema](#database-schema)
4. [File Structure](#file-structure)
5. [API Endpoints](#api-endpoints)
6. [Server Actions](#server-actions)
7. [Components](#components)
8. [AI Features](#ai-features)
9. [Authentication & Security](#authentication--security)
10. [Real-Time Features](#real-time-features)

---

## 🎯 Project Overview

**IssueTracker Pro** is an enterprise-grade, AI-native project management platform built with Next.js 16.2.3 and Supabase. It combines serverless AI capabilities with a modern B2B SaaS interface to provide developers with an intelligent issue tracking system.

### Key Differentiators:
- **AI-Powered Semantic Search**: Find issues by meaning, not just keywords (using Hugging Face embeddings)
- **Duplicate Detection**: Warns users of semantically similar tickets with cosine similarity matching
- **Groq-Powered RAG Chatbot**: Real-time database queries for context-aware project status
- **Smart Auto-Tagging**: Automatic priority and type classification using Groq LLM
- **Vector Database**: PostgreSQL with pgvector extension for 384-dimensional embeddings
- **Drag-and-Drop Kanban**: Real-time board with @dnd-kit library
- **Real-Time Sync**: Supabase Realtime for instant board updates across users

---

## 🏗️ Architecture & Tech Stack

### Frontend & Runtime
- **Framework**: Next.js 16.2.3 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4 with PostCSS
- **State Management**: React Hooks (useState, useTransition)
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/utilities

### Backend & Database
- **Server**: Next.js Server Actions
- **Database**: PostgreSQL + pgvector (via Supabase)
- **Auth**: Supabase Auth (Email/Password) with SSR support
- **Real-Time**: Supabase Realtime subscriptions

### AI & ML Services
- **Embeddings**: Hugging Face Serverless Inference API (all-MiniLM-L6-v2)
  - Output: 384-dimensional vectors
  - Use Case: Semantic search & duplicate detection
- **LLM**: Groq API (llama-3.1-8b-instant)
  - Use Case: Auto-tagging & RAG chatbot
- **Email**: Resend API (commented out in code)

### Additional Libraries
- **Toast Notifications**: react-hot-toast
- **HTTP Client**: Built-in fetch API
- **Embedding Pipeline**: @xenova/transformers (local ONNX support - not currently used)

### Deployment Target
- **Vercel** (Serverless, 50MB limit - hence cloud embeddings architecture)

---

## 🗄️ Database Schema

### Tables Referenced in Code:

#### **issues**
```sql
- id (UUID, Primary Key)
- title (TEXT, REQUIRED)
- description (TEXT, REQUIRED)
- status (TEXT: "OPEN", "IN_PROGRESS", "IN_REVIEW", "DONE")
- priority (TEXT: "LOW", "MEDIUM", "HIGH", "CRITICAL")
- type (TEXT: "BUG", "FEATURE", "TASK")
- created_by (UUID, Foreign Key → profiles.id)
- assigned_to (UUID, Foreign Key → profiles.id, NULLABLE)
- embedding (VECTOR(384), for semantic search)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **comments**
```sql
- id (UUID, Primary Key)
- issue_id (UUID, Foreign Key → issues.id)
- user_id (UUID, Foreign Key → profiles.id)
- content (TEXT)
- created_at (TIMESTAMP)
```

#### **profiles**
```sql
- id (UUID, Primary Key, Foreign Key → auth.users.id)
- email (TEXT)
- created_at (TIMESTAMP)
```

#### **admins**
```sql
- user_id (UUID, Foreign Key → profiles.id)
```

### Database Functions (RPC):

#### **match_issues()**
```sql
Parameters:
- query_embedding: vector(384) - The embedding to search against
- match_threshold: float - Minimum cosine similarity (0.5 or 0.6)
- match_count: int - Number of results to return (5)
- current_issue_id (OPTIONAL): UUID - Exclude this issue from results

Returns:
- id, title, description, priority, status, similarity
- Uses pgvector cosine distance operator (<=>)
```

---

## 📁 File Structure

```
issue-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with Toaster provider
│   │   ├── page.tsx                # Landing page (hero + features)
│   │   ├── globals.css             # Tailwind directives
│   │   ├── middleware.ts           # Supabase session middleware
│   │   ├── actions/
│   │   │   ├── ai.ts              # AI functions (auto-tag, embeddings, RAG)
│   │   │   ├── auth.ts            # Authentication (login, signup, logout)
│   │   │   ├── comments.ts        # Comments server action
│   │   │   └── issues.ts          # CRUD & search operations
│   │   ├── api/
│   │   │   └── issues/
│   │   │       └── route.ts       # REST endpoints (GET, POST)
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Main dashboard (Kanban board)
│   │   │   └── loading.tsx        # Loading skeleton
│   │   ├── login/
│   │   │   └── page.tsx           # Login form UI
│   │   └── signUp/
│   │       └── page.tsx           # Sign-up form UI (not fully shown)
│   ├── components/
│   │   ├── KanbanBoard.tsx        # Main board container with real-time sync
│   │   ├── KanbanColumn.tsx       # Individual status columns
│   │   ├── IssueCard.tsx          # Draggable card with related tickets
│   │   ├── CreateIssueModal.tsx   # Modal with duplicate detection
│   │   ├── StatusDropdown.tsx     # Status change selector
│   │   ├── AssigneeDropdown.tsx   # Assignee selector
│   │   ├── DeleteIssueButton.tsx  # Admin-only delete
│   │   ├── ChatBot.tsx            # Floating AI chatbot window
│   │   ├── Comments.tsx           # Comments thread UI
│   │   ├── SearchBox.tsx          # Global search
│   │   └── BoardFilters.tsx       # Filter controls (commented out)
│   └── utils/
│       ├── resend.ts              # Email service client
│       └── supabase/
│           ├── server.ts          # Server-side Supabase client
│           ├── client.ts          # Client-side Supabase client
│           └── middleware.ts      # Session update middleware
├── public/                         # Static assets
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript config
├── next.config.ts                  # Next.js config
├── tailwind.config.mjs             # Tailwind theme config
├── eslint.config.mjs               # ESLint rules
├── postcss.config.mjs              # PostCSS plugins
└── README.md                        # Setup instructions
```

---

## 🔌 API Endpoints

### **Base URL**: `http://localhost:3000/api`

---

### 1. **GET** `/api/issues`
**Purpose**: Fetch all issues (requires API key authentication)

**Headers Required**:
```
Authorization: Bearer {DEVELOPER_API_KEY}
```

**Query Parameters**: None

**Response (200 OK)**:
```json
{
  "issues": [
    {
      "id": "uuid",
      "title": "Login button is broken",
      "description": "...",
      "status": "OPEN",
      "priority": "HIGH",
      "type": "BUG",
      "created_by": "user-uuid",
      "assigned_to": "user-uuid or null",
      "embedding": [...384 numbers...],
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid Authorization header
  ```json
  { "success": false }
  ```

---

### 2. **POST** `/api/issues`
**Purpose**: Create a new issue via REST API (requires API key authentication)

**Headers Required**:
```
Authorization: Bearer {DEVELOPER_API_KEY}
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Login button is broken",
  "description": "The login button on the homepage is not clickable"
}
```

**Response (201 Created)**:
```json
{
  "userData": {
    "id": "new-uuid",
    "title": "Login button is broken",
    "description": "...",
    "status": "OPEN",
    "created_by": "system-user-uuid"
  }
}
```

**Error Responses**:
- **400 Bad Request**: Missing title field
  ```json
  { "error": "Title is required" }
  ```
- **401 Unauthorized**: Invalid API key
  ```json
  { "error": "Invalid Api key" }
  ```
- **500 Internal Server Error**: Database error
  ```json
  { "success": false, "error": "Database error message" }
  ```

**Authentication Note**: Uses `DEVELOPER_API_KEY` environment variable for API key validation. This is separate from user authentication.

---

## ⚙️ Server Actions

Server Actions are secure functions that execute on the server. All data mutations and AI calls go through these.

### **File**: `src/app/actions/issues.ts`

---

### 1. **createIssue(formData)**
**Purpose**: Create a new issue with AI auto-tagging and embedding generation

**Input Parameters**:
```typescript
formData: FormData {
  title: string
  description: string
}
```

**Process Flow**:
1. Extracts title & description from FormData
2. Calls `autoTagIssue()` to generate priority and type via Groq
3. Calls `generateCordinates()` to create embedding via Hugging Face
4. Inserts into Supabase `issues` table with embedding
5. Revalidates `/dashboard` cache

**Return Value**:
```typescript
{
  success: boolean,
  error?: string  // If failed
}
```

**Error Handling**:
- Throws if user not authenticated
- Returns error if database insert fails

---

### 2. **updateIssue(issueId, newStatus)**
**Purpose**: Update issue status and send Discord notification on completion

**Input Parameters**:
```typescript
issueId: string        // UUID of issue
newStatus: string      // "OPEN" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
```

**Process Flow**:
1. Authenticates user
2. Updates status in database
3. If status is "DONE":
   - Constructs Discord message
   - POSTs to `DISCORD_WEBHOOK_URL` environment variable
4. Revalidates dashboard

**Return Value**:
```typescript
{
  success: boolean,
  error?: string
}
```

**Side Effects**: Sends Discord webhook notification (silently fails if webhook URL missing)

---

### 3. **deleteIssue(issueId)**
**Purpose**: Delete an issue (admin-only)

**Input Parameters**:
```typescript
issueId: string  // UUID of issue to delete
```

**Access Control**:
- Queries `admins` table to check if user has admin role
- Returns 403 if user not in admins table

**Process Flow**:
1. Authenticates user
2. Checks admin status by querying `admins` table
3. Deletes from `issues` table
4. Revalidates dashboard

**Return Value**:
```typescript
{
  success: boolean,
  error?: string  // "Access Denied: Admins Only" if not admin
}
```

---

### 4. **updateIssueAssignee(issueId, assigneeId)**
**Purpose**: Assign or unassign an issue to a team member

**Input Parameters**:
```typescript
issueId: string              // UUID of issue
assigneeId: string | null    // UUID of user to assign (null = unassign)
```

**Process Flow**:
1. Authenticates user
2. Updates `assigned_to` column in issues table
3. Fetches assignee's email from profiles table
4. (Commented out) Would send Resend email notification
5. Revalidates dashboard

**Return Value**:
```typescript
{
  success: boolean,
  error?: string
}
```

---

### 5. **searchIssues(searchQuery): SearchResult[] | null**
**Purpose**: Semantic search using AI embeddings and database RPC

**Input Parameters**:
```typescript
searchQuery: string  // User's search question
```

**Return Type**:
```typescript
type SearchResult = {
  id: string
  title: string
  description: string
  priority: string
  status: string
  similarity: number  // Cosine similarity score (0-1)
}
```

**Process Flow**:
1. Generates embedding for search query via `generateCordinates()`
2. Calls Supabase RPC `match_issues()` with:
   - `query_embedding`: Generated from search query
   - `match_threshold`: 0.5 (50% similarity minimum)
   - `match_count`: 5 (return top 5 results)
3. Returns array of matching issues sorted by similarity

**Example Usage**:
```typescript
// User types "login button broken" in search box
const results = await searchIssues("login button broken");
// Returns similar issues like "Login form not working"
```

---

### 6. **getNearIssues(id, title, description): SearchResult[] | null**
**Purpose**: Find semantically similar issues for duplicate warning on card hover

**Input Parameters**:
```typescript
id: string           // Current issue ID (to exclude from results)
title: string        // Issue title
description: string  // Issue description
```

**Process Flow**:
1. Combines title + description: `"${title} : ${description}"`
2. Generates embedding for combined text
3. Calls RPC `match_issues()` with:
   - `match_threshold`: 0.6 (higher threshold than search)
   - `match_count`: 5
   - `current_issue_id`: id (excludes this issue)
4. Returns related tickets

**Used By**: IssueCard component to show "Related Issues" section

---

### 7. **backfillOldTickets()**
**Purpose**: Backfill missing embeddings for existing issues without vector data

**Process Flow**:
1. Fetches all issues where `embedding IS NULL`
2. For each ticket:
   - Combines title + description
   - Generates embedding via Hugging Face
   - Updates issue with embedding vector
3. Logs success/failure for each ticket

**Return Value**:
```typescript
{
  success: boolean,
  message: string
}
```

**Use Case**: Maintenance function for migrating old tickets to vector-enabled database

---

### **File**: `src/app/actions/auth.ts`

---

### 1. **loginUser(email, password)**
**Purpose**: Authenticate user with Supabase Auth

**Input Parameters**:
```typescript
email: string     // User email
password: string  // User password
```

**Process Flow**:
1. Creates Supabase client
2. Calls `auth.signInWithPassword()`
3. On success: Redirects to `/dashboard`
4. On error: Returns error message

**Return Value**:
```typescript
{
  success: false,
  error: string  // Error message only on failure
  // On success: Redirects (no return)
}
```

---

### 2. **signUpUser(email, password)**
**Purpose**: Create new user account

**Input Parameters**:
```typescript
email: string
password: string
```

**Process Flow**:
1. Calls `auth.signUp()` via Supabase
2. On success: Redirects to `/dashboard`
3. On error: Returns error

**Return Value**:
```typescript
{
  succes: false,  // Note: typo in original code ("succes" not "success")
  error: string
}
```

---

### 3. **logoutUser()**
**Purpose**: Sign out user and destroy session

**Input Parameters**: None

**Process Flow**:
1. Calls `auth.signOut()`
2. Redirects to `/login`

**Return Value**:
```typescript
{
  sucess: false,  // Only on error
  error: string
}
```

---

### **File**: `src/app/actions/comments.ts`

---

### 1. **addComment(issueId, content)**
**Purpose**: Add a comment to an issue

**Input Parameters**:
```typescript
issueId: string   // UUID of issue
content: string   // Comment text
```

**Process Flow**:
1. Authenticates user
2. Inserts into `comments` table with:
   - `issue_id`: issueId
   - `content`: comment text
   - `user_id`: authenticated user's ID
3. Fetches all comments for the issue (including author email via join)
4. Revalidates dashboard

**Return Value**:
```typescript
{
  success: boolean,
  error?: string
}
```

---

### **File**: `src/app/actions/ai.ts`

---

### 1. **autoTagIssue(title, description): AITags | null**
**Purpose**: Automatically classify issue priority and type using Groq LLM

**Input Parameters**:
```typescript
title: string       // Issue title
description: string // Issue description
```

**AI Prompt**:
```
You are an expert agile project manager analyzing a new Kanban board ticket.
Determine the most logical priority and type for this ticket based on the text.

Return EXACTLY this JSON structure, and nothing else:
{
    "priority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "type": "BUG" | "FEATURE" | "TASK"
}
```

**Groq Configuration**:
- Model: `llama-3.1-8b-instant`
- Response Format: JSON object
- API Key: `GROQ_API_KEY` environment variable

**Return Value**:
```typescript
type AITags = {
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  type: "BUG" | "FEATURE" | "TASK"
} | null  // null on error
```

**Example**:
```typescript
const tags = await autoTagIssue(
  "Login button broken",
  "Users cannot click the login button on homepage"
);
// Returns: { priority: "HIGH", type: "BUG" }
```

---

### 2. **generateCordinates(text): number[] | null**
**Purpose**: Convert text to 384-dimensional embedding vector via Hugging Face

**Input Parameters**:
```typescript
text: string  // Text to embed (title, description, search query, etc.)
```

**Hugging Face Configuration**:
- Model: `sentence-transformers/all-MiniLM-L6-v2`
- Endpoint: Hugging Face Router API (serverless)
- Output: Array of 384 floats
- Authorization: `HUGGINGFACE_API_KEY` Bearer token
- Wait for Model: `true` (ensures model is loaded)

**Process Flow**:
1. POSTs text to Hugging Face API
2. Receives 2D array: `[[384 floats]]`
3. Extracts first array element (384-dimensional vector)

**Return Value**:
```typescript
number[] | null  // Array of 384 floats, or null on error
```

**Error Handling**:
- Logs HuggingFace API errors
- Returns null if response not OK
- Catches and logs fetch errors

---

### 3. **projectManager(userQuestion): { success, answer }**
**Purpose**: RAG (Retrieval-Augmented Generation) chatbot powered by Groq

**Input Parameters**:
```typescript
userQuestion: string  // User's question about project
```

**Process Flow**:
1. **Retrieval Phase**:
   - Generates embedding for user question
   - Calls `searchIssues()` to find related tickets
   - Builds context from top 5 matches with:
     - Ticket title, status, description
     - Similarity score as percentage

2. **Augmentation Phase**:
   - Constructs system prompt with retrieved context
   - If no tickets found: Uses fallback message

3. **Generation Phase**:
   - Calls Groq with augmented prompt
   - Model: `llama-3.1-8b-instant`
   - Temperature: 0.3 (low creativity, factual)
   - System instructions: Answer ONLY from provided tickets

**Groq System Prompt**:
```
You are a highly efficient Project Manager Assistant for an Issue Tracker.
Your job is to answer the user's question based ONLY on the provided database tickets.

Rules:
1. Be concise, professional, and helpful.
2. If the user asks about something that is NOT in the provided tickets, you MUST reply: 
   "I'm sorry, I don't see any tickets related to that in the current database." 
   Do not guess or make up features.
3. Mention the specific ticket titles or statuses if it helps answer the question.
```

**Return Value**:
```typescript
{
  success: boolean,
  answer: string  // AI response or error message
}
```

**Example Flow**:
```
User: "What's the status of the login bug?"
→ Searches for embedding of "What's the status of the login bug?"
→ Finds related tickets like "Login button broken", "Auth system issue"
→ Sends to Groq with context about these tickets
→ Groq responds: "I see two related tickets. The 'Login button broken' 
   ticket is currently IN_PROGRESS, and the 'Auth system issue' is DONE."
```

---

## 🧩 Components

### **File**: `src/components/KanbanBoard.tsx`

**Purpose**: Main container managing all Kanban columns, real-time sync, and drag-and-drop

**Props**:
```typescript
{
  initialIssues: Issue[],      // Issues from server
  profiles: Profile[]           // Team members for assignee selector
}
```

**Key Features**:
- **Hydration Check**: Uses `isMounted` state to prevent hydration mismatch
- **Real-Time Subscriptions**: Supabase Realtime channel listening to `issues` table
- **Event Handling**:
  - `UPDATE`: Replaces issue in state
  - `INSERT`: Adds new issue (dedupes already-fetched tickets)
  - `DELETE`: Removes issue from state
- **Drag & Drop**: Uses `@dnd-kit/core` DndContext wrapper
- **Optimistic Updates**: Updates UI immediately on drag, confirms with server

**Local State**:
```typescript
isMounted: boolean              // Hydration flag
issues: Issue[]                 // All issues in board
```

**Key Functions**:
- `handleDragEnd(event)`: Processes drop event
  - Gets issue ID and new status from drag event
  - Updates local state immediately (optimistic)
  - Calls `updateIssue()` server action
  - Falls back if status unchanged

---

### **File**: `src/components/KanbanColumn.tsx`

**Purpose**: Renders a single status column with droppable zone

**Props**:
```typescript
{
  columnId: string,    // Status: "OPEN", "IN_PROGRESS", "IN_REVIEW", "DONE"
  issues: Issue[],
  profiles: Profile[]
}
```

**Features**:
- **Droppable Zone**: @dnd-kit droppable area
- **Issue Cards**: Maps issues to IssueCard components
- **Count Badge**: Shows number of issues in column

---

### **File**: `src/components/IssueCard.tsx`

**Purpose**: Individual draggable issue card with metadata and duplicate detection

**Props**:
```typescript
{
  issue: Issue,
  profiles: Profile[]
}
```

**Features**:
- **Draggable**: @dnd-kit draggable element
- **Status Dropdown**: Change issue status
- **Assignee Dropdown**: Assign to team member
- **Type Badge**: Shows BUG, FEATURE, or TASK
- **Priority Color**: RED (CRITICAL), ORANGE (HIGH), YELLOW (MEDIUM), GRAY (LOW)
- **Modal Link**: Click title to open full issue details
- **Related Tickets**: Click "Find Related" to show similar issues via vector search
  - Shows similarity percentage
  - Loads asynchronously with loading state

**Local State**:
```typescript
isExpanded: boolean                     // Show related tickets
relatedTickets: {id, title, similarity}[] // Vector search results
isLoadingRelated: boolean               // Loading state
```

---

### **File**: `src/components/CreateIssueModal.tsx`

**Purpose**: Modal form for creating new issues with real-time duplicate detection

**Features**:
- **Form Fields**:
  - Title (required, min 5 chars)
  - Description (required, textarea)
- **Duplicate Detection**:
  - Triggers after 800ms debounce when title length ≥ 5
  - Shows warning banner if similarity ≥ 60%
  - Displays match percentage for each duplicate
  - Uses `searchIssues()` server action
- **Auto-Tagging**: Groq automatically assigns priority & type
- **Embedding**: Hugging Face generates vector on creation
- **Success Toast**: Shows confirmation on creation
- **Error Handling**: Displays validation errors

**Local State**:
```typescript
isOpen: boolean               // Modal visibility
title: string                 // Current title input
isLoading: boolean            // Form submission state
duplicates: SearchResult[]    // Found duplicates
isChecking: boolean           // Duplicate search in progress
error: string | null          // Error message
```

---

### **File**: `src/components/StatusDropdown.tsx`

**Purpose**: Dropdown menu for changing issue status

**Props**:
```typescript
{
  issueId: string,
  currentStatus: string
}
```

**Options**:
- OPEN
- IN_PROGRESS
- IN_REVIEW
- DONE

**Behavior**:
- Calls `updateIssue()` on selection
- Shows toast notification
- Handles Discord webhook for DONE status

---

### **File**: `src/components/AssigneeDropdown.tsx`

**Purpose**: Dropdown for assigning/unassigning issues to team members

**Props**:
```typescript
{
  issueId: string,
  currentAssigneeId: string | null,
  profiles: Profile[]
}
```

**Options**:
- "Unassigned" (null value)
- Each team member (from profiles list)

**Behavior**:
- Calls `updateIssueAssignee()` on selection
- Shows current assignee's email
- Filters out already-assigned assignee

---

### **File**: `src/components/DeleteIssueButton.tsx`

**Purpose**: Admin-only button to delete issues

**Props**:
```typescript
{
  issueId: string
}
```

**Behavior**:
- Calls `deleteIssue()` server action
- Shows confirmation before deleting
- Returns error if user not admin
- Removes card from board on success

---

### **File**: `src/components/Comments.tsx`

**Purpose**: Comments thread for issues

**Props**:
```typescript
{
  issueId: string,
  initialComments: Comment[]
}
```

**Features**:
- Displays list of comments with author email
- Form to add new comments
- Calls `addComment()` server action
- Auto-refreshes on submission

**Comment Structure**:
```typescript
{
  id: string
  content: string
  created_at: string
  profiles: { email: string }  // Author info
}
```

---

### **File**: `src/components/ChatBot.tsx`

**Purpose**: Floating AI chatbot window for RAG queries

**Features**:
- **Floating Button**: Bottom-right corner, toggles chat
- **Chat Window**: 
  - Header: Title + Powered by RAG & Groq
  - Message History: User and AI messages
  - Auto-scroll to latest message
- **Input Form**: Text input + send button
- **Loading Indicator**: Animated dots during response
- **Disabled State**: Disables input while loading

**Local State**:
```typescript
isOpen: boolean               // Window visibility
input: string                 // Current input text
isLoading: boolean            // Waiting for response
messages: Message[]           // Chat history
```

**Message Structure**:
```typescript
type Message = {
  id: string
  role: "user" | "ai"
  content: string
}
```

**Process Flow**:
1. User types question and hits send
2. Message added to UI immediately
3. Calls `projectManager()` server action
4. AI response displayed with 2-second auto-scroll

---

### **File**: `src/components/SearchBox.tsx`

**Purpose**: Global search bar for semantic or keyword filtering

**Behavior**:
- Updates URL search params (not shown in detail)
- Filters board by `ilike` (case-insensitive keyword match)

---

### **File**: `src/components/BoardFilters.tsx`

**Purpose**: Filter controls for assignee, priority, status (currently commented out)

---

---

## 🤖 AI Features

### 1. **Semantic Duplicate Detection**

**Where**: CreateIssueModal component & IssueCard component

**Flow**:
```
User Types Title
    ↓
(800ms debounce triggers)
    ↓
generateCordinates(title) → Hugging Face API
    ↓
searchIssues(title) → Supabase RPC match_issues()
    ↓
Filter results where similarity ≥ 0.60
    ↓
Display warning banner with match %
```

**Technology**:
- Embeddings: all-MiniLM-L6-v2 (384-dim)
- Distance: Cosine similarity
- Database: pgvector (<=> operator)

**Example**:
```
User creates: "Login button not working"
System finds: 
  - "Login form broken" (85% match)
  - "Auth system down" (72% match)
```

---

### 2. **Smart Auto-Tagging**

**Where**: CreateIssue server action

**Flow**:
```
Issue Created
    ↓
autoTagIssue(title, description) → Groq API
    ↓
LLM analyzes and returns:
  {
    priority: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL",
    type: "BUG" | "FEATURE" | "TASK"
  }
    ↓
Saved to database automatically
```

**Groq Model**: llama-3.1-8b-instant
**Response Format**: Structured JSON (enforced)

**Example**:
```
Input: 
  Title: "Users can't login"
  Description: "After recent deployment, login fails with 500 error"

Output:
  { priority: "CRITICAL", type: "BUG" }
```

---

### 3. **RAG Chatbot (Project Manager)**

**Where**: Chatbot.tsx component

**Architecture**:
```
User Question
    ↓
generateCordinates(question) → Hugging Face
    ↓
searchIssues(question) → Database
    ↓
Groq augmented prompt:
  System: "Answer using ONLY these tickets..."
  Context: Top 5 matched tickets with details
  User: "Original question"
    ↓
LLM streams response
    ↓
Display in chat window
```

**Safety Guardrails**:
- Model: llama-3.1-8b-instant
- Temperature: 0.3 (factual, not creative)
- System prompt requires: Only answer from provided context
- Fallback: "I don't see tickets related to that"

**Example**:
```
User: "What's blocking the payment feature?"

Database finds:
- "Payment gateway timeout" (IN_PROGRESS)
- "Stripe API key invalid" (DONE)
- "Currency conversion bug" (OPEN)

Groq Response:
"I found 3 related tickets. The main blocker appears to be 
'Payment gateway timeout' which is currently IN_PROGRESS. 
Additionally, we had 'Stripe API key invalid' which is now DONE."
```

---

### 4. **Vector Similarity Search**

**Core Algorithm**: Cosine Distance (pgvector)

**Database Query**:
```sql
SELECT 
  id, title, description, priority, status,
  1 - (embedding <=> query_embedding) as similarity
FROM issues
WHERE 1 - (embedding <=> query_embedding) > match_threshold
  AND (current_issue_id IS NULL OR id != current_issue_id)
ORDER BY similarity DESC
LIMIT match_count
```

**Parameters**:
- `match_threshold`: 0.5 (global search), 0.6 (duplicate warning)
- `match_count`: 5 (top 5 results)
- `current_issue_id`: Exclude self from results

---

## 🔐 Authentication & Security

### **Authentication Method**: Supabase Auth with SSR

**Files**:
- `src/utils/supabase/server.ts`: Server-side client
- `src/utils/supabase/client.ts`: Client-side client
- `src/utils/supabase/middleware.ts`: Session update handler
- `src/middleware.ts`: Next.js middleware

---

### **Login Flow**

```
1. User submits email/password on /login
   ↓
2. loginUser(email, password) server action
   ↓
3. Supabase Auth validates credentials
   ↓
4. Session cookie set (secure, httpOnly)
   ↓
5. Redirect to /dashboard
   ↓
6. Middleware updates session on each request
```

**Files Involved**:
- `src/app/login/page.tsx`: Form UI
- `src/app/actions/auth.ts`: Server action

---

### **Protected Routes**

**Middleware**: `src/middleware.ts`
```typescript
matcher: [
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
]
```

**Protection Mechanism**:
- `updateSession()` runs on every route request
- Supabase SSR client refreshes session from cookies
- Invalid sessions redirect to login

---

### **Row Level Security (RLS)**

**Database Policies** (not shown in code but referenced):
- Users can only create issues for themselves
- Users can only view/edit issues in their workspace
- Admins can delete any issue

---

### **API Key Authentication**

**Endpoint**: `/api/issues`

**Method**: Bearer token in Authorization header

**Environment Variable**: `DEVELOPER_API_KEY`

**Flow**:
```
GET /api/issues
  Authorization: Bearer abc123def456
    ↓
Check: "Bearer abc123def456" === "Bearer ${DEVELOPER_API_KEY}"
    ↓
Valid → Return issues
Invalid → Return 401 with error
```

---

### **Environment Variables Required**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# AI Services
GROQ_API_KEY=gsk_abc123...
HUGGINGFACE_API_KEY=hf_abc123...

# API Authentication
DEVELOPER_API_KEY=your-secure-api-key

# Integrations
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

---

## � WebSocket Architecture & Real-Time Features

### **Overview**

IssueTracker Pro uses **WebSockets** for real-time collaboration, enabling instant board updates across multiple users without page refreshes. This is powered by **Supabase Realtime**, which maintains persistent TCP connections between the client browser and Supabase infrastructure.

---

### **How WebSockets Work Here**

**Technology Stack**:
- **Transport Layer**: WebSockets (persistent bi-directional connection)
- **Fallback**: Long-polling if WebSocket unavailable (automatic)
- **Platform**: Supabase Realtime (built on Postgres NOTIFY/LISTEN)
- **Protocol**: PostgREST events + PostgreSQL's native replication stream

**Connection Flow**:
```
1. Browser opens tab → IssueTracker loads
2. KanbanBoard component mounts
3. Supabase client establishes WebSocket connection
4. Client subscribes to 'postgres_changes' on 'issues' table
5. Connection stays open (typically 30 seconds keep-alive ping)
6. Any DB change triggers real-time event
7. All subscribed clients receive payload
8. UI updates instantly (no refresh needed)
```

---

### **Supabase Realtime Subscriptions**

**Where**: `src/components/KanbanBoard.tsx`

**Subscription Setup**:
```typescript
const channel = supabaseClient
  .channel('issues-sync')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'issues' },
    handlePayload
  )
  .subscribe()
```

**Channel Configuration**:
- **Channel Name**: `'issues-sync'` (arbitrary, groups related subscriptions)
- **Event Type**: `'postgres_changes'` (Supabase Realtime event)
- **Filter**: 
  - `event: '*'` (all events: INSERT, UPDATE, DELETE)
  - `schema: 'public'` (only public schema)
  - `table: 'issues'` (only issues table)
  - Implicitly: All rows (no row-level filtering)

---

### **Real-Time Event Handling**

#### **UPDATE Event** ⚡
```typescript
if (payload.eventType === 'UPDATE') {
  setIssues(currentIssues =>
    currentIssues.map(issue =>
      issue.id === payload.new.id 
        ? payload.new  // Replace with updated version
        : issue
    )
  )
}
```
**Triggered When**: Any issue property changes (status, assignee, priority, etc.)

**Real-World Scenario**:
```
User A: Drags issue from "OPEN" to "IN_PROGRESS"
   ↓
updateIssue(issueId, "IN_PROGRESS") server action executes
   ↓
PostgreSQL UPDATE query executes on User A's database
   ↓
Postgres triggers replication event
   ↓
Supabase detects change, broadcasts via WebSocket
   ↓
User B's browser receives: 
   {
     eventType: 'UPDATE',
     new: { id: 'xxx', status: 'IN_PROGRESS', ... },
     old: { id: 'xxx', status: 'OPEN', ... }
   }
   ↓
KanbanBoard updates React state
   ↓
Card instantly moves to "IN_PROGRESS" column on User B's screen
```

**Payload Structure**:
```typescript
payload = {
  eventType: 'UPDATE',
  schema: 'public',
  table: 'issues',
  commit_timestamp: '2025-01-15T10:30:45Z',
  errors: null,
  new: { /* Full updated issue object */ },
  old: { /* Previous issue state */ }
}
```

**Performance Note**: React's `map()` function is O(n). With thousands of issues, consider using a HashMap for faster lookups.

---

#### **INSERT Event** ✨
```typescript
if (payload.eventType === 'INSERT') {
  // Check if issue already in state (Next.js hydration)
  const exists = currentIssues.some(i => i.id === payload.new.id)
  
  if (exists) return currentIssues  // Avoid duplicates
  
  return [...currentIssues, payload.new]  // Add new issue
}
```
**Triggered When**: New issue created by any user

**Critical Detail - Hydration Deduplication**:
```
User A creates new issue
   ↓
Server action: createIssue() executes
   ↓
INSERT into database + revalidatePath("/dashboard")
   ↓
Next.js rerenders dashboard on ALL clients
   ↓
Server sends NEW FULL PAGE with latest issue
   ↓
User A's browser: Issue already in local state from optimistic update
   ↓
User B's browser: Next.js hydrates page with issue
   ↓
SIMULTANEOUSLY, WebSocket fires INSERT event with same issue
   ↓
CHECK: Is issue.id already in currentIssues?
   ✓ YES (from server-side hydration) → SKIP adding
   ✓ NO (for users who didn't get hydration) → ADD it
```

**Why Deduplication Matters**:
- Without it, same issue appears twice in board
- One from server render, one from WebSocket
- Creates visual glitch and React key conflicts

**Real-World Flow**:
```
User A: Clicks "+ New Issue" → Fills form → Submits
   ↓ (optimistic update in component - NOT shown here, but happens)
   ↓
Server creates issue: { id: 'uuid-123', title: 'Bug', status: 'OPEN' }
   ↓
revalidatePath() triggers ISR
   ↓
All users: Dashboard page refetches issues (hydration)
   ↓
WebSocket: INSERT event fires
   ↓
User A: Issue already in state → Skip
User B: Issue from server + WebSocket → Handle correctly
User C: Browser offline → Gets it from server on refresh
```

---

#### **DELETE Event** 🗑️
```typescript
if (payload.eventType === 'DELETE') {
  setIssues(currentIssues =>
    currentIssues.filter(issue => issue.id !== payload.old.id)
  )
}
```
**Triggered When**: Admin deletes an issue

**Real-Time Behavior**:
```
Admin: Clicks delete on issue (ID: xyz)
   ↓
deleteIssue(xyz) executes with admin check
   ↓
DELETE FROM issues WHERE id = 'xyz'
   ↓
WebSocket broadcasts DELETE event
   ↓
All clients: Issue removed from state
   ↓
Card instantly disappears from Kanban board
   ↓
No reload required
```

**Note**: Card doesn't stay deleted if page refreshed without proper cleanup

---

### **Cleanup & Unsubscription**

**Where**: KanbanBoard.tsx useEffect return function

```typescript
return () => {
  if (supabaseClient && channel) {
    supabaseClient.removeChannel(channel)  // Unsubscribe and close WebSocket
  }
}
```

**When Executed**:
- When component unmounts (user navigates away)
- When dependencies change (unlikely in this case)

**Why Important**:
- Prevents memory leaks
- Closes WebSocket connection properly
- Allows Supabase to clean up server-side resources
- Prevents duplicate subscriptions if component remounts

---

### **WebSocket Connection Lifecycle**

```
┌─────────────────────────────────────────┐
│     Browser Tab Opens                   │
├─────────────────────────────────────────┤
│ 1. Supabase client initializes          │
│    - Reads JWT from httpOnly cookie     │
│    - Prepares auth headers              │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│     WebSocket Handshake                 │
├─────────────────────────────────────────┤
│ 2. Browser sends HTTP Upgrade request   │
│    - Connection: upgrade                │
│    - Upgrade: websocket                 │
│    - Sec-WebSocket-Key: [random]        │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│     Connection Established ✓            │
├─────────────────────────────────────────┤
│ 3. Supabase sends server handshake      │
│ 4. Authentication validated             │
│ 5. Client subscribed to channels        │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│     Active Connection                   │
├─────────────────────────────────────────┤
│ Keep-Alive: 30-second pings             │
│ Listen: Real-time events flowing in     │
│ Send: User actions (if applicable)      │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│     User Navigates Away                 │
├─────────────────────────────────────────┤
│ removeChannel() called                  │
│ WebSocket gracefully closes             │
│ Browser frees resources                 │
└─────────────────────────────────────────┘
```

---

### **Performance & Scalability Considerations**

**Advantages**:
- ✅ **Instant Updates**: <50ms latency typically
- ✅ **No Polling**: Saves server CPU vs. constant polling
- ✅ **Bandwidth Efficient**: Only sends changed fields
- ✅ **Collaborative**: Multiple users see same board state

**Potential Issues**:
- ⚠️ **Too Many Subscriptions**: Each connection uses memory
- ⚠️ **Broadcast Storm**: Many users updating same table = many events
- ⚠️ **Network Drop**: Auto-reconnects but brief sync gap possible
- ⚠️ **Browser Memory**: Thousands of issues in state = slower React renders

**Optimization Strategies** (Not Currently Implemented):
1. Row-level filtering: Only subscribe to user's workspace
2. Pagination: Keep only visible issues in state
3. Event throttling: Batch multiple updates
4. Local caching: Cache old events to avoid refetch

---

## 💬 Discord Integration

### **Overview**

IssueTracker Pro sends notifications to Discord when issues reach completion. This enables team communication in their existing Discord server without requiring users to check the app constantly.

**Current Implementation**: Webhook-based integration (one-way notifications)

---

### **Where Discord Integration Happens**

**File**: `src/app/actions/issues.ts` → `updateIssue()` function

**Trigger**: When issue status changes to `"DONE"`

```typescript
if(newStatus === "DONE"){
    const message = {
        content: `TASK COMPLETED TICKET ${issueId} WAS JUST MOVED TO DONE`
    }
    try{
        await fetch(process.env.DISCORD_WEBHOOK_URL!,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(message),
        })
    }catch(error){
        console.log("Failed to ping discord",error)
    }
}
```

---

### **How It Works**

**Step-by-Step Flow**:

```
1. User drags issue card to "DONE" column
   ↓
2. updateIssue(issueId, "DONE") executes on server
   ↓
3. Database UPDATE completes
   ↓
4. Check: newStatus === "DONE" ?
   ✓ YES → Continue to Discord
   ✓ NO → Skip Discord notification
   ↓
5. Construct Discord message payload:
   {
     "content": "TASK COMPLETED TICKET 12345 WAS JUST MOVED TO DONE"
   }
   ↓
6. POST to DISCORD_WEBHOOK_URL
   - URL: https://discord.com/api/webhooks/{webhook_id}/{webhook_token}
   - Method: POST
   - Content-Type: application/json
   ↓
7. Discord server receives notification
   ↓
8. Message posted to specified channel
   ↓
9. Catch any errors silently (fail gracefully)
```

---

### **Discord Webhook Setup**

**To Enable**:

1. Open Discord server
2. Go to desired channel → Channel Settings → Webhooks
3. Click "Create Webhook"
4. Copy webhook URL: `https://discord.com/api/webhooks/ABC123/XYZ789`
5. Add to `.env.local`:
   ```bash
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/ABC123/XYZ789
   ```

**Environment Variable**:
```typescript
process.env.DISCORD_WEBHOOK_URL!
```
- `!` = TypeScript assertion (throws if undefined)
- If missing: Code will crash on DONE status change

**Better Approach** (Not implemented):
```typescript
if (!process.env.DISCORD_WEBHOOK_URL) {
  console.warn("Discord webhook URL not configured")
  return
}
```

---

### **Example Discord Message**

**Current Output**:
```
TASK COMPLETED TICKET 550e8400-e29b-41d4-a716-446655440000 WAS JUST MOVED TO DONE
```

**Issues**:
- ❌ Raw UUID (hard to read)
- ❌ All caps (jarring)
- ❌ No context (which issue? what was it?)
- ❌ No user info (who completed it?)
- ❌ No timestamp (when?)

**Suggested Improvement**:
```typescript
const message = {
  embeds: [{
    title: "✅ Task Completed",
    description: `Issue: **${issueTitle}**`,
    fields: [
      { name: "Issue ID", value: issueId.slice(0, 8), inline: true },
      { name: "Priority", value: issuePriority, inline: true },
      { name: "Completed By", value: userName, inline: true },
    ],
    color: 2597183,  // Green
    timestamp: new Date().toISOString()
  }]
}
```

**This Would Show**:
```
✅ Task Completed
Issue: Login button is now clickable
Issue ID: 550e8400
Priority: HIGH
Completed By: John Smith
[timestamp]
```

---

### **Error Handling**

**Current Approach**:
```typescript
try {
  await fetch(process.env.DISCORD_WEBHOOK_URL!, {...})
} catch(error) {
  console.log("Failed to ping discord", error)
}
```

**Issues**:
- ❌ Silently logs to server console (user doesn't know)
- ❌ No retry logic (if Discord temporarily down, message lost)
- ❌ No validation of webhook URL format
- ❌ Generic error message (doesn't help debugging)

**What Can Go Wrong**:
- `404`: Webhook deleted or invalid ID
- `401`: Webhook token expired or invalid
- `429`: Rate limited (sending too many messages)
- `500`: Discord server error
- `Network`: No internet connection

**Current Behavior**:
- If webhook fails → Issue status still changes to DONE (correct!)
- Discord notification just doesn't arrive
- User has no idea notification failed

---

### **Potential Enhancements**

**Immediate Wins**:
1. ✅ Format Discord messages with embeds (rich formatting)
2. ✅ Include issue title, priority, and assignee
3. ✅ Add rich context (description snippet)
4. ✅ Show who completed the task

**Advanced Features**:
1. 🔄 Two-way sync (allow Discord commands like `/complete-issue`)
2. 📊 Daily digest (summary of completed tasks)
3. 🏷️ Mentions (@channel when CRITICAL task done)
4. 📱 Priority-based notifications (only alert for HIGH/CRITICAL)
5. 🔐 Multiple webhook URLs for different channels
   - Critical tasks → #critical-channel
   - Regular tasks → #completed-tasks
   - Bugs → #bug-reports

---

### **Rate Limiting & Abuse Prevention**

**Discord Webhook Limits**:
- 30 requests per 60 seconds per webhook
- If exceeded: 429 Too Many Requests response

**Scenario** (potential issue):
```
User creates many issues and quickly marks them DONE
→ Each DONE status = Discord POST
→ If >30 in 60 seconds → Rate limit
→ Subsequent messages queued/dropped
```

**Mitigation** (Not implemented):
```typescript
// Batch discord messages
// Or debounce webhook calls
// Or use Discord bot (higher limits) instead of webhook
```

---

### **Security Considerations**

**Webhook URL Security**:
- ✅ Stored in `.env.local` (not committed to git)
- ✅ Only accessible on server (not exposed to client)
- ⚠️ Anyone with this URL can post to Discord channel
- ⚠️ GitHub secrets exposure would compromise channel

**Best Practices**:
1. Use Discord bot with OAuth instead of webhook (more control)
2. Rotate webhook tokens periodically
3. Monitor Discord channel for unexpected messages
4. Log all webhook calls (for audit trail)

---

### **Discord Message Payload Structure**

**Current Structure** (Simple):
```json
{
  "content": "TASK COMPLETED TICKET ... WAS JUST MOVED TO DONE"
}
```

**Enhanced Structure** (With embeds):
```json
{
  "content": "Issue completed!",
  "embeds": [
    {
      "title": "Task Completed",
      "description": "Login button is now clickable",
      "fields": [
        { "name": "Priority", "value": "HIGH", "inline": true },
        { "name": "Type", "value": "BUG", "inline": true },
        { "name": "Assignee", "value": "John Doe", "inline": true }
      ],
      "color": 2597183,
      "timestamp": "2025-01-15T10:30:45Z"
    }
  ]
}
```

---

### **Related Server Actions**

**Functions that Interact with Discord**:

1. **updateIssue()** ✓ Sends Discord notification
2. **createIssue()** ✗ Could notify (new ticket created)
3. **deleteIssue()** ✗ Could notify (ticket deleted - admin action)
4. **updateIssueAssignee()** ✗ Could notify (assignment changed)

**Enhancement Opportunity**:
Create a central `notifyDiscord()` function to handle all notifications consistently.

---

## 📡 Real-Time Features

**Pattern Used**: Update UI → Call server → Revert on error

**Example** (Kanban Drag-and-Drop):
```typescript
async function handleDragEnd(event) {
  const newStatus = event.over.id
  
  // 1. Update UI immediately
  setIssues(current =>
    current.map(issue =>
      issue.id === draggedId 
        ? { ...issue, status: newStatus }
        : issue
    )
  )
  
  // 2. Confirm with server asynchronously
  const result = await updateIssue(draggedId, newStatus)
  
  // 3. If server fails, local state already updated (or you'd revert here)
}
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 16 Frontend                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Login Page  │→ │  Dashboard   │→ │   Chatbot    │      │
│  │  (Auth)      │  │  (Kanban)    │  │   (RAG)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│       ↓                 ↓                    ↓              │
│  loginUser()      updateIssue()      projectManager()      │
│  signUpUser()     createIssue()      searchIssues()        │
│  logoutUser()     deleteIssue()      generateCordinates() │
│                   updateAssignee()   autoTagIssue()       │
│                   searchIssues()                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
        ↓                    ↓                    ↓
   ┌─────────────┐  ┌─────────────────┐  ┌────────────────┐
   │ Supabase    │  │  Groq API       │  │ Hugging Face   │
   │ Auth + DB   │  │  (LLM)          │  │ (Embeddings)   │
   └─────────────┘  └─────────────────┘  └────────────────┘
        ↓                    ↓
   ┌─────────────────────────────────────┐
   │  PostgreSQL + pgvector              │
   │  (Issues, Comments, Embeddings)     │
   └─────────────────────────────────────┘
```

---

## 🎯 Key Workflows

### **Creating an Issue**

```
User fills form (title, description)
         ↓
Form submitted → createIssue() server action
         ↓
1. autoTagIssue() → Groq labels priority & type
2. generateCordinates() → Hugging Face creates embedding
3. Insert into DB with all metadata
4. Revalidate /dashboard cache
         ↓
Next.js ISR: Page recomputed
         ↓
Supabase Realtime: INSERT event fires
         ↓
All connected clients receive update via WebSocket
         ↓
KanbanBoard component: New card appears in OPEN column
```

---

### **Searching for Issues**

```
User types in search box / chatbot
         ↓
searchIssues(query) server action
         ↓
1. generateCordinates(query) → Embedding from Hugging Face
2. Supabase RPC match_issues():
   - Uses pgvector to find similar embeddings
   - Calculates cosine similarity
   - Filters by threshold (0.5 or 0.6)
   - Returns top 5 results with similarity scores
         ↓
Results displayed with match percentages
```

---

### **Chatbot Interaction**

```
User asks "What's the status of payment feature?"
         ↓
projectManager(question) server action
         ↓
1. searchIssues(question) → Find related tickets
   - "Payment gateway timeout" (IN_PROGRESS)
   - "Stripe integration" (DONE)
   - "Currency conversion" (OPEN)
         ↓
2. Build augmented prompt with context
         ↓
3. Groq processes augmented prompt
   - Temperature: 0.3 (factual)
   - Only uses provided context
   - Refuses to make up information
         ↓
4. Response: "I found 3 tickets... the main blocker is..."
         ↓
Displayed in chat window
```

---

## 🐛 Known Limitations & TODOs

1. **Email Notifications**: Currently commented out in `updateIssueAssignee()`
   - Ready to use Resend API when uncommented
   - Needs email template configuration

2. **Backfill Endpoint**: `backfillOldTickets()` is available but may need manual trigger
   - Could be exposed as admin action button

3. **BoardFilters Component**: Commented out in dashboard
   - Ready to implement filtering UI

4. **Sign-up Page**: `/signUp/page.tsx` exists but not shown in code
   - Implementation likely mirrors login form

5. **Embedding Pipeline**: `@xenova/transformers` imported but not used
   - Original local ONNX implementation removed for Vercel
   - Could be useful for development

6. **Typos in Code**:
   - `succes` instead of `success` in signUp/logout return
   - Should be fixed for consistency

---

## 🚀 Performance Optimizations

1. **Database Layer**: Vector similarity computed in PostgreSQL (not Node)
2. **Vercel Deployment**: No ML weights in serverless function (90MB saved)
3. **Image Optimization**: Next.js Image component ready
4. **ISR**: `revalidatePath()` for incremental static regeneration
5. **Optimistic Updates**: UI updates before server confirmation
6. **Debouncing**: 800ms delay on duplicate search (not on every keystroke)
7. **Lazy Loading**: Chatbot renders only when opened
8. **Hydration Check**: `isMounted` flag prevents hydration mismatch on Kanban

---

## 📝 Summary

**IssueTracker Pro** is a sophisticated, modern issue tracker that combines:

- ✅ **Backend**: Next.js 16 Server Actions + Supabase PostgreSQL
- ✅ **AI**: Groq LLM for auto-tagging & RAG chatbot
- ✅ **ML**: Hugging Face embeddings for semantic search
- ✅ **Database**: pgvector for similarity search
- ✅ **Real-Time**: Supabase Realtime for live board sync
- ✅ **UI**: Tailwind CSS + @dnd-kit for Kanban
- ✅ **Auth**: Supabase Auth with SSR
- ✅ **DevOps**: Vercel deployment ready

The project demonstrates advanced architecture patterns: serverless AI, vector databases, real-time collaboration, and Vercel-optimized serverless deployment.

