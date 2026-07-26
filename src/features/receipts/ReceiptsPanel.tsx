import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  getReceipts,
  getReceiptEmail,
  type Receipt,
  type ReceiptEmail,
  type ReceiptStatus,
} from "@/lib/receipts";
import { EmailPreviewModal } from "@/components/EmailPreviewModal";

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

// fechaEmision es una fecha calendario (medianoche UTC), no un instante — hay
// que fijar timeZone: "UTC" o el navegador la corre un día según su huso horario.
const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const statusLabel: Record<ReceiptStatus, string> = {
  pending: "Pendiente",
  processed: "Procesado",
  failed: "Fallido",
};

const statusClassName: Record<ReceiptStatus, string> = {
  pending: "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
  processed: "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  failed: "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20",
};

export function ReceiptsPanel() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [email, setEmail] = useState<ReceiptEmail | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const loadReceipts = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    setError(null);

    try {
      setReceipts(await getReceipts());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReceipts(false);
  }, [loadReceipts]);

  async function openEmail(receipt: Receipt) {
    setSelectedId(receipt.id);
    setEmail(null);
    setEmailError(null);
    setEmailLoading(true);

    try {
      setEmail(await getReceiptEmail(receipt.id));
    } catch (err: unknown) {
      setEmailError(err instanceof Error ? err.message : String(err));
    } finally {
      setEmailLoading(false);
    }
  }

  function closeEmail() {
    setSelectedId(null);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Bandeja de entrada</h1>
          <p className="text-sm text-neutral-400">
            Recibos por Honorarios procesados
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadReceipts(true)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 rounded-md border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      {loading && <p className="text-neutral-400">Cargando recibos...</p>}

      {!loading && error && (
        <p className="text-red-400">
          No se pudo conectar con el backend: {error}
        </p>
      )}

      {!loading && !error && receipts.length === 0 && (
        <p className="text-neutral-400">Todavía no hay recibos procesados.</p>
      )}

      {!loading && !error && receipts.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900">
          <table className="min-w-full divide-y divide-neutral-800 text-sm">
            <thead className="bg-neutral-800/50 text-left text-xs uppercase text-neutral-400">
              <tr>
                <th className="px-4 py-3">RUC</th>
                <th className="px-4 py-3">Razón social</th>
                <th className="px-4 py-3">Serie-número</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-right">Monto neto</th>
                <th className="px-4 py-3 text-right">Retención</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {receipts.map((receipt) => (
                <tr
                  key={receipt.id}
                  onClick={() => openEmail(receipt)}
                  className="cursor-pointer hover:bg-neutral-800/40"
                >
                  <td className="px-4 py-3 whitespace-nowrap">{receipt.ruc}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{receipt.razonSocial}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{receipt.serieNumero}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-300">
                    {dateFormatter.format(new Date(receipt.fechaEmision))}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {currencyFormatter.format(receipt.montoNeto)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap text-neutral-300">
                    {receipt.retencion != null
                      ? currencyFormatter.format(receipt.retencion)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${statusClassName[receipt.status]}`}
                    >
                      {statusLabel[receipt.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedId != null && (
        <EmailPreviewModal
          email={email}
          loading={emailLoading}
          error={emailError}
          onClose={closeEmail}
        />
      )}
    </div>
  );
}
