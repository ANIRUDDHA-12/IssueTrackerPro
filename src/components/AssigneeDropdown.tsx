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
      className="max-w-30 truncate rounded border-none bg-gray-50 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 focus:ring-0 disabled:opacity-50"
    >
      <option value="UNASSIGNED">Unassigned</option>
      {/* We loop through the profiles from the database to create the options */}
      {profiles.map((profile) => (
        <option key={profile.id} value={profile.id}>
          {profile.email}
        </option>
      ))}
    </select>
  );
}