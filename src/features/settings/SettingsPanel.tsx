import { Settings } from "lucide-react";

export function SettingsPanel() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-white">Configuración</h1>
        <p className="text-sm text-neutral-400">Ajustes de la plataforma</p>
      </div>

      <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-neutral-800 bg-neutral-900/50 p-8">
        <Settings size={28} strokeWidth={1.5} className="text-neutral-500" />
        <h2 className="text-base font-semibold text-neutral-200">
          Todavía no hay nada configurable
        </h2>
        <p className="text-sm text-neutral-500">
          Acá van a vivir los ajustes de la plataforma cuando los necesitemos
          (buzón de ingesta, notificaciones, usuarios, etc.).
        </p>
      </div>
    </div>
  );
}
