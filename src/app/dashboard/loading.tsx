export default function DashboardLoading(){
    return (
    <div className="p-6 h-full w-full">
      <div className="flex gap-4 h-full overflow-hidden">
        {/* Loop through 3 columns to mimic a Kanban board */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-80 shrink-0 bg-gray-100 rounded-lg p-4">
            <div className="h-6 w-24 bg-gray-300 rounded mb-4 animate-pulse" />
            
            {/* Mimic a few cards inside each column */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-24 w-full bg-white rounded-md shadow-sm animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}