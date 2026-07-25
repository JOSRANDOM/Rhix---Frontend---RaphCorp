import { useState } from "react";
import { Eye, File, FileText, X } from "lucide-react";
import {
  getReceiptPDFUrl,
  getReceiptXMLUrl,
  type ReceiptEmail,
  type ReceiptEmailAttachment,
} from "@/lib/receipts";
import { XMLPreviewModal } from "@/components/XMLPreviewModal";
import { PDFPreviewModal } from "@/components/PDFPreviewModal";

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
  const [xmlPreview, setXmlPreview] = useState<{ id: number; title: string } | null>(null);
  const [xmlContent, setXmlContent] = useState<string | null>(null);
  const [xmlLoading, setXmlLoading] = useState(false);
  const [xmlError, setXmlError] = useState<string | null>(null);

  const [pdfPreview, setPdfPreview] = useState<{ id: number; title: string } | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  async function openXmlPreview(att: ReceiptEmailAttachment) {
    setXmlPreview({ id: att.id, title: `${att.serieNumero}.xml` });
    setXmlContent(null);
    setXmlError(null);
    setXmlLoading(true);

    try {
      const res = await fetch(getReceiptXMLUrl(att.id));
      if (!res.ok) throw new Error(`Error ${res.status} al obtener el XML`);
      setXmlContent(await res.text());
    } catch (err: unknown) {
      setXmlError(err instanceof Error ? err.message : String(err));
    } finally {
      setXmlLoading(false);
    }
  }

  function closeXmlPreview() {
    setXmlPreview(null);
  }

  async function openPdfPreview(att: ReceiptEmailAttachment) {
    setPdfPreview({ id: att.id, title: `${att.serieNumero}.pdf` });
    setPdfUrl(null);
    setPdfError(null);
    setPdfLoading(true);

    try {
      const res = await fetch(getReceiptPDFUrl(att.id));
      if (!res.ok) throw new Error(`Error ${res.status} al obtener el PDF`);
      const blob = await res.blob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setPdfError(err instanceof Error ? err.message : String(err));
    } finally {
      setPdfLoading(false);
    }
  }

  function closePdfPreview() {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfPreview(null);
    setPdfUrl(null);
  }

  return (
    <>
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
                        className="flex flex-col gap-1 rounded-md bg-neutral-800/50 px-3 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm text-neutral-300">
                            <File size={15} className="shrink-0 text-neutral-500" />
                            {att.serieNumero}.xml
                          </span>
                          <span className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => openXmlPreview(att)}
                              className="flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-neutral-200"
                            >
                              <Eye size={15} />
                              Vista previa
                            </button>
                            <a
                              href={getReceiptXMLUrl(att.id)}
                              className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
                            >
                              Descargar
                            </a>
                          </span>
                        </div>

                        {att.hasPdf && (
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm text-neutral-300">
                              <FileText size={15} className="shrink-0 text-neutral-500" />
                              {att.serieNumero}.pdf
                            </span>
                            <span className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => openPdfPreview(att)}
                                className="flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-neutral-200"
                              >
                                <Eye size={15} />
                                Vista previa
                              </button>
                              <a
                                href={getReceiptPDFUrl(att.id)}
                                className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
                              >
                                Descargar
                              </a>
                            </span>
                          </div>
                        )}
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

      {xmlPreview && (
        <XMLPreviewModal
          title={xmlPreview.title}
          content={xmlContent}
          loading={xmlLoading}
          error={xmlError}
          onClose={closeXmlPreview}
        />
      )}

      {pdfPreview && (
        <PDFPreviewModal
          title={pdfPreview.title}
          url={pdfUrl}
          loading={pdfLoading}
          error={pdfError}
          onClose={closePdfPreview}
        />
      )}
    </>
  );
}
