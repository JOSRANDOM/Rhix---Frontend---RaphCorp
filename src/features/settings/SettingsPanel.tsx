import { useEffect, useState } from "react";
import { Mail, SlidersHorizontal, User } from "lucide-react";
import { getPlatformConfig, type PlatformConfig } from "@/lib/config";

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
    <div className="flex h-full flex-col items-start gap-3 rounded-lg border border-dashed border-neutral-800 bg-neutral-900/50 p-8">
      <Icon size={28} strokeWidth={1.5} className="text-neutral-500" />
      <h2 className="text-base font-semibold text-neutral-200">{title}</h2>
      <p className="text-sm text-neutral-500">{description}</p>
    </div>
  );
}

function AdvancedSettings() {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getPlatformConfig()
      .then((data) => {
        if (!cancelled) setConfig(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-full flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={20} strokeWidth={1.75} className="text-neutral-500" />
        <h2 className="text-base font-semibold text-neutral-200">Avanzado</h2>
      </div>

      {loading && <p className="text-sm text-neutral-400">Cargando...</p>}

      {!loading && error && (
        <p className="text-sm text-red-400">
          No se pudo conectar con el backend: {error}
        </p>
      )}

      {!loading && !error && config && (
        <div className="flex flex-col gap-1 rounded-md bg-neutral-800/50 p-4">
          <span className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase">
            <Mail size={13} />
            Correo de la bandeja de entrada
          </span>
          <span className="font-mono text-sm text-neutral-200">
            {config.imapUser || "No configurado"}
          </span>
          <p className="mt-2 text-xs text-neutral-500">
            Los Recibos por Honorarios que lleguen como adjunto a este correo
            se procesan automáticamente y aparecen en Bandeja de entrada y
            Archivos.
          </p>
        </div>
      )}
    </div>
  );
}

export function SettingsPanel() {
  const [tab, setTab] = useState<SettingsView>("user");

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 shrink-0">
        <h1 className="text-lg font-semibold text-white">Configuración</h1>
        <p className="text-sm text-neutral-400">Ajustes de la plataforma</p>
      </div>

      <div className="flex flex-1 gap-6">
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

          {tab === "advanced" && <AdvancedSettings />}
        </div>
      </div>
    </div>
  );
}
