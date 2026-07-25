import { BarChart3, FileText, Inbox } from "lucide-react";

export type View = "inbox" | "files" | "reports";

interface NavItem {
  key: View;
  label: string;
  icon: typeof Inbox;
}

const items: NavItem[] = [
  { key: "inbox", label: "Bandeja de entrada", icon: Inbox },
  { key: "files", label: "Archivos", icon: FileText },
  { key: "reports", label: "Reportes", icon: BarChart3 },
];

interface SidebarProps {
  active: View;
  onChange: (view: View) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="group flex w-16 shrink-0 flex-col overflow-hidden border-r border-neutral-800 bg-neutral-900 transition-[width] duration-200 ease-in-out hover:w-60">
      <div className="flex h-14 shrink-0 items-center px-4">
        <span className="text-lg font-semibold whitespace-nowrap text-white opacity-0 transition-opacity delay-75 duration-150 group-hover:opacity-100">
          Rhix
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              title={label}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-600/15 text-emerald-400"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
              }`}
            >
              <Icon size={18} strokeWidth={1.75} className="shrink-0" />
              <span className="whitespace-nowrap opacity-0 transition-opacity delay-75 duration-150 group-hover:opacity-100">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
