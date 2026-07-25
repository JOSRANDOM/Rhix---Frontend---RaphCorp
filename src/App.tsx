import { useState } from "react";
import { Sidebar, type View } from "@/components/Sidebar";
import { ReceiptsPanel } from "@/features/receipts/ReceiptsPanel";
import { FilesPanel } from "@/features/files/FilesPanel";
import { ReportsPanel } from "@/features/reports/ReportsPanel";

function App() {
  const [view, setView] = useState<View>("inbox");

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <Sidebar active={view} onChange={setView} />

      <main className="flex-1 p-6">
        {view === "inbox" && <ReceiptsPanel />}

        {view === "files" && <FilesPanel />}

        {view === "reports" && <ReportsPanel />}
      </main>
    </div>
  );
}

export default App;
