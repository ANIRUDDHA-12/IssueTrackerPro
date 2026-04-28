"use client";

import { Toast } from "react-hot-toast";
import { useTransition } from "react";
import { updateIssue } from "@/app/actions/issues";

export default function StatusDropdown({ 
  issueId, 
  currentStatus 
}: { 
  issueId: string; 
  currentStatus: string; 
}) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    // startTransition prevents the page from freezing while the server action runs
    startTransition(async () => {
      await updateIssue(issueId, newStatus);
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-md px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="OPEN" className="bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">OPEN</option>
      <option value="IN_PROGRESS" className="bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">IN_PROGRESS</option>
      <option value="IN_REVIEW" className="bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">IN_REVIEW</option>
      <option value="DONE" className="bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">DONE</option>
    </select>
  );
}