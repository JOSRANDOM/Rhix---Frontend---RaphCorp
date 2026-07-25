import { File, X } from "lucide-react";
import { getReceiptXMLUrl, type ReceiptEmail } from "@/lib/receipts";

interface EmailPreviewModalProps {
  email: ReceiptEmail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-16 shrink-0 text-neutral-500">{label}</span>
      <span className="text-neutral-200">{value}</span>
    </div>
  );
}

export function EmailPreviewModal({
  email,
  loading,
  error,
  onClose,
}: EmailPreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <h2 className="text-sm font-medium text-neutral-100">Correo original</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-auto p-4">
          {loading && <p className="text-sm text-neutral-400">Cargando...</p>}

          {!loading && error && <p className="text-sm text-red-400">{error}</p>}

          {!loading && !error && email && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-b border-neutral-800 pb-3">
                <Field label="De" value={email.from || "—"} />
                <Field label="Para" value={email.to || "—"} />
                {email.cc && <Field label="Copia" value={email.cc} />}
                <Field label="Asunto" value={email.subject || "—"} />
              </div>

              <p className="text-sm whitespace-pre-wrap text-neutral-300">
                {email.body || "(este correo no tiene cuerpo de texto)"}
              </p>

              {email.attachments.length > 0 && (
                <div className="border-t border-neutral-800 pt-3">
                  <h3 className="mb-2 text-xs font-medium text-neutral-500 uppercase">
                    Archivos recibidos ({email.attachments.length})
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {email.attachments.map((att) => (
                      <li
                        key={att.id}
                        className="flex items-center justify-between rounded-md bg-neutral-800/50 px-3 py-2"
                      >
                        <span className="flex items-center gap-2 text-sm text-neutral-300">
                          <File size={15} className="shrink-0 text-neutral-500" />
                          {att.serieNumero}.xml
                        </span>
                        <a
                          href={getReceiptXMLUrl(att.id)}
                          className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
                        >
                          Descargar
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
