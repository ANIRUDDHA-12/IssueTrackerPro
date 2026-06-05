# 🎯 IssueTracker Pro

> **Enterprise-Grade AI-Native Issue Tracking** — Semantic search meets real-time collaboration

An intelligent project management platform that understands your tickets by *meaning*, not just keywords. Built with Next.js, Supabase, and serverless AI—featuring vector embeddings, RAG-powered chatbots, real-time WebSocket sync, and Discord notifications.

![Next.js](https://img.shields.io/badge/Next.js-16.2+-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E) ![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Core Features

### 🧠 **AI-Powered Semantic Search**
Don't search by keywords—search by *meaning*. IssueTracker Pro embeds every ticket into a 384-dimensional vector space, then uses cosine similarity to find semantically related issues. Understand the "vibe" of your codebase, not just exact matches.

**Example**: Search for *"login button broken"* and find:
- "Auth form not clickable" (92% match)
- "Sign-in page unresponsive" (87% match)

**Technology**: Hugging Face `sentence-transformers/all-MiniLM-L6-v2` embeddings + PostgreSQL `pgvector`

### ⚠️ **Duplicate Detection**
Real-time AI-powered warnings prevent duplicate tickets from clogging your backlog. As you type a new issue, the system instantly flags related tickets with match percentages.

```
User Creates: "Login button not working"
System Warns: "Login form broken (85% match)" ⚠️
```

### 🤖 **RAG Chatbot (AI Project Manager)**
A floating AI assistant that queries your database in real-time. Ask natural language questions:

- *"What's blocking the payment feature?"*
- *"How many critical bugs are open?"*
- *"Who's assigned the most tasks?"*

The chatbot searches your issue database for context, then synthesizes answers using Groq LLM—guaranteeing factual responses grounded in your actual data.

**Temperature**: 0.3 (factual, not creative) | **Model**: Groq `llama-3.1-8b-instant`

### 🏷️ **Smart Auto-Tagging**
No more manual categorization. Every new issue is automatically labeled with:
- **Priority**: LOW, MEDIUM, HIGH, CRITICAL
- **Type**: BUG, FEATURE, TASK

Uses Groq to analyze issue content and apply consistent taxonomy.

### 📊 **Real-Time Kanban Board**
Three-column drag-and-drop board (OPEN → IN_PROGRESS → DONE) with instant multi-user sync via **WebSockets**. Changes propagate <50ms across all connected clients.

**Tech**: `@dnd-kit/core` for drag-and-drop + Supabase Realtime for live updates

### 🔔 **Discord Integration**
Completed tasks automatically notify your Discord server. Fully customizable webhook integration for team awareness.

```
✅ Task Completed
Issue: Login button is now clickable
Priority: HIGH | Type: BUG
Completed By: John Smith
```

### 🔐 **Enterprise Authentication**
Secure email/password auth with Supabase, session management, and Row-Level Security (RLS) policies. TypeScript ensures type-safe auth flows.

---

## 🏗️ Architecture at a Glance

```
┌────────────────────────────────────────────────────────────┐
│           Frontend (React 19 + TypeScript)                 │
│  Kanban Board  │  Chatbot  │  Search  │  Create Modal      │
└──────────────────┬─────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼────────┐      ┌─────▼────────┐
    │ WebSockets │      │ Server Actions
    │ (Real-time)│      │ (Secure Mutations)
    └───┬────────┘      └─────┬────────┘
        │                     │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────────┐
        │  PostgreSQL + pgvector  │
        │  (384-dim embeddings)   │
        └──────────┬──────────────┘
                   │
        ┌──────────┼──────────────┐
        │          │              │
    ┌───▼──┐  ┌────▼────┐  ┌─────▼─────┐
    │ Groq │  │ Hugging │  │  Discord  │
    │ LLM  │  │  Face   │  │  Webhooks │
    └──────┘  │Embeddings  └───────────┘
             └─────────┘
```

### 🎯 **Why This Architecture?**

- **Vercel-Optimized**: Zero ML weights in serverless functions (refactored from ONNX)
- **Database-Layer Filtering**: Vector search happens in PostgreSQL, not Node
- **Server Actions**: No REST endpoints—all mutations secure on the server
- **Real-Time Collaboration**: WebSocket subscriptions keep teams in sync
- **Serverless Scalability**: Hugging Face API handles embeddings, Groq handles LLM

---

## 🔧 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, TypeScript 5 | Type-safe UI components |
| **Framework** | Next.js 16 (App Router) | Server Actions, ISR, middleware |
| **Styling** | Tailwind CSS 4 | Responsive B2B SaaS design |
| **UI Library** | @dnd-kit/core | Drag-and-drop Kanban |
| **Notifications** | react-hot-toast | Toast alerts |
| **Database** | PostgreSQL + pgvector | Relational + vector storage |
| **Authentication** | Supabase Auth (SSR) | Secure session management |
| **Real-Time** | Supabase Realtime | WebSocket subscriptions |
| **AI/ML** | Groq API | LLM (auto-tagging, RAG) |
| **Embeddings** | Hugging Face Router API | Vector generation (serverless) |
| **Integrations** | Discord Webhooks | Notification delivery |
| **Hosting** | Vercel | Optimal Next.js deployment |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ & npm
- **Supabase** account (free tier OK)
- **Groq API** key (free tier available)
- **Hugging Face** fine-grained token (free tier OK)
- **Discord** server & webhook (optional, for notifications)

### Step 1: Clone & Install

```bash
git clone https://github.com/ANIRUDDHA-12/IssueTrackerPro.git
cd IssueTrackerPro/issue-tracker
npm install
```

### Step 2: Configure Environment Variables

Create `.env.local` in the root:

```bash
# Supabase (from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Groq (from https://console.groq.com)
GROQ_API_KEY=gsk_abc123...

# Hugging Face (from https://huggingface.co/settings/tokens)
# Must have "Make calls to the Serverless Inference API" permission
HUGGINGFACE_API_KEY=hf_abc123...

# API Authentication (generate a secure random string)
DEVELOPER_API_KEY=your-secure-api-key-here

# Discord Webhook (optional, from your Discord server)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/ABC/XYZ

# System User (for API-created issues)
API_SYSTEM_USER_ID=system-uuid-here
```

### Step 3: Database Setup

1. Go to your Supabase project → SQL Editor
2. Enable `pgvector` extension:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

3. Create tables:
```sql
-- Issues table
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'OPEN',
  priority TEXT DEFAULT 'LOW',
  type TEXT DEFAULT 'TASK',
  created_by UUID REFERENCES auth.users(id),
  assigned_to UUID,
  embedding vector(384),
  created_at TIMESTAMP DEFAULT now()
);

-- Create RPC for semantic search
CREATE OR REPLACE FUNCTION match_issues(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5,
  current_issue_id UUID DEFAULT NULL
) RETURNS TABLE(id UUID, title TEXT, description TEXT, priority TEXT, status TEXT, similarity FLOAT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    issues.id,
    issues.title,
    issues.description,
    issues.priority,
    issues.status,
    1 - (issues.embedding <=> query_embedding) as similarity
  FROM issues
  WHERE issues.embedding IS NOT NULL
    AND (1 - (issues.embedding <=> query_embedding)) > match_threshold
    AND (current_issue_id IS NULL OR issues.id != current_issue_id)
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📖 Core Workflows

### Creating an Issue (with AI Magic)

```
1. User clicks "+ New Issue"
2. Fills title & description
3. Real-time duplicate check (semantic search)
4. Auto-tagging: Groq LLM → {priority, type}
5. Embedding generation: Hugging Face → 384-dim vector
6. Save to PostgreSQL with embedding
7. Real-time notification via WebSocket
8. All connected clients see new card instantly
```

**Result**: New issue appears in OPEN column with smart categorization.

### Semantic Search Example

```
Query: "Payment gateway timeout"
    ↓
Hugging Face generates embedding
    ↓
PostgreSQL pgvector finds similar issues using cosine distance
    ↓
Results:
  1. "Stripe payment processing slow" (89% match)
  2. "API rate limiting on charges" (76% match)
  3. "Webhook timeout on payment" (72% match)
```

### AI Chatbot Interaction

```
User: "What's blocking the payment feature?"
    ↓
Question → Embedding → Semantic search
    ↓
Find related issues in database
    ↓
Build augmented prompt with retrieved context
    ↓
Groq LLM synthesizes answer (temperature: 0.3 for factual responses)
    ↓
Response: "I found 3 related tickets. The main blocker appears
           to be 'Stripe payment processing slow' which is 
           IN_PROGRESS and assigned to Jane..."
```

---

## 🌐 Real-Time Features

### WebSocket Architecture

Every connected browser maintains a **persistent WebSocket connection** to Supabase. Database changes broadcast instantly:

```
User A drags issue to "DONE"
    ↓
Server updates PostgreSQL
    ↓
PostgreSQL triggers Realtime event
    ↓
Supabase broadcasts via WebSocket
    ↓
Users B, C, D see card move instantly (<50ms latency)
```

**Events Handled**:
- **UPDATE**: Issue changed (status, priority, assignee, etc.)
- **INSERT**: New issue created
- **DELETE**: Issue removed (admin-only)

### Discord Notifications

When a task reaches "DONE" status:
```
Issue marked DONE
    ↓
updateIssue(issueId, "DONE") executes
    ↓
POST to Discord webhook URL
    ↓
Team notified in Discord channel (optional embeds with rich context)
```

---

## 🔌 API Endpoints

### REST API (for external integrations)

**Authentication**: Bearer token in `Authorization` header

#### GET `/api/issues`
Fetch all issues (requires `DEVELOPER_API_KEY`)

```bash
curl -H "Authorization: Bearer your-api-key" \
  http://localhost:3000/api/issues
```

**Response**:
```json
{
  "issues": [
    {
      "id": "uuid",
      "title": "Login button broken",
      "status": "OPEN",
      "priority": "HIGH",
      "type": "BUG",
      "embedding": [...384 floats...],
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### POST `/api/issues`
Create a new issue via API

```bash
curl -X POST \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"title": "Bug: Login fails", "description": "..."}' \
  http://localhost:3000/api/issues
```

**Response** (201 Created):
```json
{
  "userData": {
    "id": "new-uuid",
    "title": "Bug: Login fails",
    "status": "OPEN"
  }
}
```

---

## 🛠️ Server Actions (Internal API)

All mutations use **Next.js Server Actions** (secure, no REST overhead):

### Issue Management
- `createIssue(formData)` — Create with auto-tagging & embedding
- `updateIssue(id, status)` — Change status + trigger Discord
- `deleteIssue(id)` — Admin-only deletion
- `updateIssueAssignee(id, assigneeId)` — Assign to team member
- `searchIssues(query)` — Semantic search
- `getNearIssues(id, title, desc)` — Find related issues
- `backfillOldTickets()` — Backfill embeddings for old issues

### AI Functions
- `autoTagIssue(title, desc)` → `{priority, type}`
- `generateCordinates(text)` → `number[384]` (Hugging Face embedding)
- `projectManager(question)` → `{success, answer}` (RAG response)

### Authentication
- `loginUser(email, password)` — Sign in
- `signUpUser(email, password)` — Register
- `logoutUser()` — Sign out

### Comments
- `addComment(issueId, content)` — Add comment with author email

---

## 🤖 AI Features Deep Dive

### 1. Smart Auto-Tagging
**When**: Issue creation
**How**: Groq analyzes title + description
**Output**: Consistent priority & type labels

```typescript
Groq Prompt:
"You are an expert agile PM. Analyze this ticket.
Return EXACTLY: {priority: LOW|MEDIUM|HIGH|CRITICAL, type: BUG|FEATURE|TASK}"

Input: "Users can't login after deploy"
Output: {priority: "CRITICAL", type: "BUG"}
```

### 2. Vector Embeddings
**Model**: Hugging Face `sentence-transformers/all-MiniLM-L6-v2`
**Output**: 384-dimensional float arrays
**Storage**: PostgreSQL `vector(384)` column
**Search**: Cosine distance (<=> operator)

Every issue gets embedded on creation. Embeddings enable semantic search, duplicate detection, and chatbot context retrieval.

### 3. RAG Chatbot
**Retrieval**: Semantic search finds top 5 related tickets
**Augmentation**: Build prompt with retrieved context
**Generation**: Groq synthesizes answer (temp: 0.3)

**Safety Guardrails**:
- Only answers from provided database context
- Refuses to speculate or make up data
- Falls back gracefully if no tickets found

---

## 📊 Database Schema

### `issues` Table
```sql
id (UUID) | title | description | status | priority | type | 
created_by | assigned_to | embedding | created_at
```

**Statuses**: OPEN, IN_PROGRESS, IN_REVIEW, DONE
**Priorities**: LOW, MEDIUM, HIGH, CRITICAL
**Types**: BUG, FEATURE, TASK

### `comments` Table
```sql
id | issue_id | user_id | content | created_at
```

### `profiles` Table
```sql
id | email | created_at
```

### `admins` Table
```sql
user_id (can delete issues)
```

### RPC Function: `match_issues()`
Performs semantic search using pgvector cosine distance
```sql
match_issues(
  query_embedding: vector(384),
  match_threshold: float = 0.5,
  match_count: int = 5,
  current_issue_id: UUID = NULL
) → SearchResult[]
```

---

## 🔐 Security

- ✅ **Supabase Auth**: Secure session cookies (httpOnly)
- ✅ **Row-Level Security**: RLS policies enforce data isolation
- ✅ **Server Actions**: No client-side database access
- ✅ **API Keys**: Stored in `.env.local` (never committed)
- ✅ **Admin Checks**: deleteIssue verifies admin status before deletion
- ✅ **Type Safety**: TypeScript prevents common vulnerabilities

---

## 📈 Performance Optimizations

1. **Database-Layer Filtering**: Vector search happens in PostgreSQL (not Node)
2. **Serverless Architecture**: No ML models in serverless functions
3. **Optimistic Updates**: UI updates before server confirmation
4. **ISR (Incremental Static Regeneration)**: `revalidatePath()` for cache invalidation
5. **Debouncing**: 800ms delay on duplicate search (not per keystroke)
6. **Lazy Loading**: Chatbot renders only when opened
7. **Hydration Safety**: `isMounted` flag prevents hydration mismatches

---

## 🐛 Known Limitations & Future Enhancements

### Current Limitations
- Email notifications commented out (ready to integrate Resend)
- Discord messages are plain text (should use rich embeds)
- No row-level WebSocket filtering (broadcasts all changes)
- Single workspace (no multi-tenant support yet)

### Roadmap
- [ ] Two-way Discord integration (commands to update issues)
- [ ] Daily digest emails
- [ ] Priority-based notification channels
- [ ] Issue templates & workflows
- [ ] Time tracking & burndown charts
- [ ] Custom fields & metadata
- [ ] Team collaboration metrics
- [ ] Mobile app (React Native)

---

## 📝 Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Documentation

For comprehensive technical documentation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) which includes:

- Complete API reference
- Detailed server actions documentation
- Component API documentation
- WebSocket architecture guide
- Discord integration guide
- Database schema documentation
- Real-time features deep dive

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with cutting-edge AI/ML tools:
- **Groq** — Lightning-fast LLM inference
- **Hugging Face** — State-of-the-art embeddings
- **Supabase** — Open-source Firebase alternative
- **Next.js** — React framework for production
- **Vercel** — Optimal serverless deployment

---

## 💬 Questions?

- **Issues & Bugs**: Open a GitHub issue
- **Discussions**: Start a discussion thread
- **Email**: [payasaniruddhaxthc@gmail.com]

---

**Made with ❤️ by Aniruddha** | *Bringing intelligence to issue tracking*