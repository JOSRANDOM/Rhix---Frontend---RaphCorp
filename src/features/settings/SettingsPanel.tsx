import { useState } from "react";
import { SlidersHorizontal, User } from "lucide-react";

type SettingsView = "user" | "advanced";

interface SettingsTab {
  key: SettingsView;
  label: string;
  icon: typeof User;
}

const tabs: SettingsTab[] = [
  { key: "user", label: "Usuario", icon: User },
  { key: "advanced", label: "Avanzado", icon: SlidersHorizontal },
];

function Placeholder({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof User;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-neutral-800 bg-neutral-900/50 p-8">
      <Icon size={28} strokeWidth={1.5} className="text-neutral-500" />
      <h2 className="text-base font-semibold text-neutral-200">{title}</h2>
      <p className="text-sm text-neutral-500">{description}</p>
    </div>
  );
}

export function SettingsPanel() {
  const [tab, setTab] = useState<SettingsView>("user");

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-white">Configuración</h1>
        <p className="text-sm text-neutral-400">Ajustes de la plataforma</p>
      </div>

      <div className="flex gap-6">
        <nav className="flex w-48 shrink-0 flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-2">
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-600/15 text-emerald-400"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                }`}
              >
                <Icon size={16} strokeWidth={1.75} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1">
          {tab === "user" && (
            <Placeholder
              icon={User}
              title="Usuario"
              description="Todavía no hay sistema de usuarios — acá van a vivir el perfil, la sesión y los permisos cuando se implemente esa integración."
            />
          )}

          {tab === "advanced" && (
            <Placeholder
              icon={SlidersHorizontal}
              title="Avanzado"
              description="Ajustes técnicos de la plataforma (buzón de ingesta, bucket de almacenamiento, etc.) — todavía no implementado."
            />
          )}
        </div>
      </div>
    </div>
  );
}
