"use client"

import { useTransition } from "react"
import { updateIssueAssignee } from "@/app/actions/issues"

type Profile = {
    id:string,
    email:string
}

export default function AssigneeDropdown({ 
  issueId, 
  currentAssigneeId,
  profiles 
}: { 
  issueId: string; 
  currentAssigneeId: string | null;
  profiles: Profile[];
}) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // If  "UNASSIGNED" is selected,send null to the database
    const newAssignee = e.target.value === "UNASSIGNED" ? null : e.target.value;
    
    startTransition(async () => {
      const result = await updateIssueAssignee(issueId, newAssignee);
      if (result && !result.success) {
        alert(`Failed to assign: ${result.error}`);
      }
    });
  };

  return (
    <select
      value={currentAssigneeId || "UNASSIGNED"}
      onChange={handleChange}
      disabled={isPending}
      className="max-w-30 truncate border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-md px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="UNASSIGNED" className="bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">Unassigned</option>
      {/* We loop through the profiles from the database to create the options */}
      {profiles.map((profile) => (
        <option key={profile.id} value={profile.id} className="bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">
          {profile.email}
        </option>
      ))}
    </select>
  );
}