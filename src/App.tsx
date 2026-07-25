import { useEffect, useState } from "react";
import { getReceipts, type Receipt, type ReceiptStatus } from "@/lib/receipts";

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
  pending: "bg-amber-100 text-amber-800",
  processed: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
};

function App() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getReceipts()
      .then((data) => {
        if (!cancelled) setReceipts(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold">Rhix</h1>
        <p className="text-sm text-gray-500">
          Panel de Recibos por Honorarios procesados
        </p>
      </header>

      <main className="p-6">
        {loading && <p className="text-gray-500">Cargando recibos...</p>}

        {!loading && error && (
          <p className="text-red-600">
            No se pudo conectar con el backend: {error}
          </p>
        )}

        {!loading && !error && receipts.length === 0 && (
          <p className="text-gray-500">Todavía no hay recibos procesados.</p>
        )}

        {!loading && !error && receipts.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
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
              <tbody className="divide-y divide-gray-100">
                {receipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{receipt.ruc}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{receipt.razonSocial}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{receipt.serieNumero}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {dateFormatter.format(new Date(receipt.fechaEmision))}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {currencyFormatter.format(receipt.montoNeto)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
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
      </main>
    </div>
  );
}

export default App;
