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
      className={`rounded px-2 py-1 text-xs font-semibold focus:outline-none disabled:opacity-50 ${
        currentStatus === 'DONE' ? 'bg-green-100 text-green-700' :
        currentStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
        'bg-yellow-100 text-yellow-800'
      }`}
    >
      <option value="OPEN">OPEN</option>
      <option value="IN_PROGRESS">IN_PROGRESS</option>
      <option value="IN_REVIEW">IN_REVIEW</option>
      <option value="DONE">DONE</option>
    </select>
  );
}