import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Bar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <span className="text-2xl font-bold tracking-tight text-indigo-600">
            IssueTracker <span className="text-slate-900">Pro</span>
          </span>
        </div>
        <div className="flex flex-1 justify-end">
          <Link
            href="/dashboard"
            className="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-600 transition-colors"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-20 sm:py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Ship software faster with <span className="text-indigo-600">AI-powered</span> clarity.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-500 max-w-2xl mx-auto">
              A modern, high-performance issue tracker built for developers. Featuring semantic vector search, intelligent duplicate detection, and a built-in RAG chatbot to manage your workflow.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
              >
                Go to Dashboard
              </Link>
              <a href="#features" className="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-600 transition-colors">
                Explore Architecture <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid (Optimized for your Portfolio) */}
      <div id="features" className="bg-white py-24 sm:py-32 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-bold leading-7 text-indigo-600 uppercase tracking-wider">Engineering First</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Beyond standard CRUD architecture.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              
              {/* Feature 1: Semantic Search */}
              <div className="relative pl-16">
                <dt className="text-base font-bold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  Semantic Duplicate Warning
                </dt>
                <dd className="mt-2 text-sm leading-6 text-slate-500">Stop logging the same bug twice. Utilizing a local neural network (all-MiniLM-L6-v2), the platform understands the mathematical meaning of tickets and warns you of duplicates before you save.</dd>
              </div>

              {/* Feature 2: RAG Chatbot */}
              <div className="relative pl-16">
                <dt className="text-base font-bold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  </div>
                  Retrieval-Augmented Generation (RAG)
                </dt>
                <dd className="mt-2 text-sm leading-6 text-slate-500">A floating AI Project Manager powered by Groq. It queries your PostgreSQL database in real-time, pulling context-aware answers about project status and team workload.</dd>
              </div>

              {/* Feature 3: Vector Math */}
              <div className="relative pl-16">
                <dt className="text-base font-bold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                  </div>
                  Vector-Mapped Relationships
                </dt>
                <dd className="mt-2 text-sm leading-6 text-slate-500">Every ticket is embedded and stored in a Supabase pgvector database. Instantly discover mathematically related issues to resolve blocked dependencies faster.</dd>
              </div>

              {/* Feature 4: Core Kanban */}
              <div className="relative pl-16">
                <dt className="text-base font-bold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                  Real-time DND Kanban
                </dt>
                <dd className="mt-2 text-sm leading-6 text-slate-500">A high-performance drag-and-drop board. Features secure Row-Level Security (RLS) ensuring users only modify data they are authorized to touch.</dd>
              </div>

            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}