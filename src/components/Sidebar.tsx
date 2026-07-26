import { BarChart3, FileText, Inbox, Receipt, Settings } from "lucide-react";

export type View = "inbox" | "files" | "reports" | "settings";

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

const bottomItems: NavItem[] = [
  { key: "settings", label: "Configuración", icon: Settings },
];

interface SidebarProps {
  active: View;
  onChange: (view: View) => void;
}

function NavButton({
  item,
  active,
  onChange,
}: {
  item: NavItem;
  active: View;
  onChange: (view: View) => void;
}) {
  const { key, label, icon: Icon } = item;
  const isActive = active === key;

  return (
    <button
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
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="group flex w-16 shrink-0 flex-col overflow-hidden border-r border-neutral-800 bg-neutral-900 transition-[width] duration-200 ease-in-out hover:w-60">
      <div className="flex h-14 shrink-0 items-center gap-2.5 px-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-950/50">
          <Receipt size={18} strokeWidth={2} className="text-neutral-950" />
        </span>
        <span className="text-lg font-semibold tracking-tight whitespace-nowrap text-white opacity-0 transition-opacity delay-75 duration-150 group-hover:opacity-100">
          Rh<span className="text-emerald-400">ix</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {items.map((item) => (
          <NavButton key={item.key} item={item} active={active} onChange={onChange} />
        ))}
      </nav>

      <nav className="flex flex-col gap-1 border-t border-neutral-800 px-2 py-2">
        {bottomItems.map((item) => (
          <NavButton key={item.key} item={item} active={active} onChange={onChange} />
        ))}
      </nav>
    </aside>
  );
}
