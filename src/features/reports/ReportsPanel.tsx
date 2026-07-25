import { FileSpreadsheet } from "lucide-react";
import { getReceiptsExportUrl } from "@/lib/receipts";

export function ReportsPanel() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-white">Reportes</h1>
        <p className="text-sm text-neutral-400">
          Exportá todos los recibos procesados a un archivo Excel
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
        <FileSpreadsheet size={28} strokeWidth={1.5} className="text-emerald-400" />
        <div>
          <h2 className="text-base font-semibold text-neutral-200">
            Recibos por Honorarios
          </h2>
          <p className="text-sm text-neutral-500">
            Genera un .xlsx con todos los recibos procesados hasta el momento.
          </p>
        </div>
        <a
          href={getReceiptsExportUrl()}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Exportar a Excel
        </a>
      </div>
    </div>
  );
}
