import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Eye, File, FileText, Folder, RefreshCw } from "lucide-react";
import { getReceipts, getReceiptPDFUrl, getReceiptXMLUrl, type Receipt } from "@/lib/receipts";
import { XMLPreviewModal } from "@/components/XMLPreviewModal";
import { PDFPreviewModal } from "@/components/PDFPreviewModal";

const folderDateFormatter = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

// Agrupamos por la fecha LOCAL de createdAt: a diferencia de fechaEmision (una
// fecha calendario pura), createdAt es un instante real — cuándo el worker
// recibió y persistió el archivo — así que mostrarlo en el huso horario del
// navegador es lo correcto acá.
function dateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface FolderGroup {
  key: string;
  date: Date;
  receipts: Receipt[];
}

function groupByReceivedDate(receipts: Receipt[]): FolderGroup[] {
  const index = new Map<string, FolderGroup>();
  const groups: FolderGroup[] = [];

  for (const receipt of receipts) {
    const key = dateKey(receipt.createdAt);
    let group = index.get(key);
    if (!group) {
      group = { key, date: new Date(receipt.createdAt), receipts: [] };
      index.set(key, group);
      groups.push(group);
    }
    group.receipts.push(receipt);
  }

  groups.sort((a, b) => b.date.getTime() - a.date.getTime());
  return groups;
}

export function FilesPanel() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  const [preview, setPreview] = useState<{ id: number; title: string } | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [pdfPreview, setPdfPreview] = useState<{ id: number; title: string } | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfPreviewLoading, setPdfPreviewLoading] = useState(false);
  const [pdfPreviewError, setPdfPreviewError] = useState<string | null>(null);

  const loadReceipts = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    setError(null);

    try {
      const data = await getReceipts();
      setReceipts(data);
      // Solo abrimos la carpeta más reciente en la carga inicial — en un
      // refresh manual respetamos lo que el usuario ya haya expandido/cerrado.
      if (!isRefresh) {
        const groups = groupByReceivedDate(data);
        if (groups.length > 0) setOpenFolders(new Set([groups[0].key]));
      }
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

  const groups = groupByReceivedDate(receipts);

  function toggleFolder(key: string) {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function openPreview(receipt: Receipt) {
    setPreview({ id: receipt.id, title: `${receipt.serieNumero}.xml` });
    setPreviewContent(null);
    setPreviewError(null);
    setPreviewLoading(true);

    try {
      const res = await fetch(getReceiptXMLUrl(receipt.id));
      if (!res.ok) {
        throw new Error(`Error ${res.status} al obtener el XML`);
      }
      setPreviewContent(await res.text());
    } catch (err: unknown) {
      setPreviewError(err instanceof Error ? err.message : String(err));
    } finally {
      setPreviewLoading(false);
    }
  }

  function closePreview() {
    setPreview(null);
  }

  async function openPdfPreview(receipt: Receipt) {
    setPdfPreview({ id: receipt.id, title: `${receipt.serieNumero}.pdf` });
    setPdfPreviewUrl(null);
    setPdfPreviewError(null);
    setPdfPreviewLoading(true);

    try {
      const res = await fetch(getReceiptPDFUrl(receipt.id));
      if (!res.ok) {
        throw new Error(`Error ${res.status} al obtener el PDF`);
      }
      const blob = await res.blob();
      setPdfPreviewUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setPdfPreviewError(err instanceof Error ? err.message : String(err));
    } finally {
      setPdfPreviewLoading(false);
    }
  }

  function closePdfPreview() {
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    setPdfPreview(null);
    setPdfPreviewUrl(null);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Archivos</h1>
          <p className="text-sm text-neutral-400">
            XML originales recibidos, agrupados por fecha
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

      {loading && <p className="text-neutral-400">Cargando archivos...</p>}

      {!loading && error && (
        <p className="text-red-400">
          No se pudo conectar con el backend: {error}
        </p>
      )}

      {!loading && !error && groups.length === 0 && (
        <p className="text-neutral-400">Todavía no se recibió ningún archivo.</p>
      )}

      {!loading && !error && groups.length > 0 && (
        <div className="flex flex-col gap-2">
          {groups.map((group) => {
            const isOpen = openFolders.has(group.key);
            return (
              <div
                key={group.key}
                className="rounded-lg border border-neutral-800 bg-neutral-900"
              >
                <button
                  type="button"
                  onClick={() => toggleFolder(group.key)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  {isOpen ? (
                    <ChevronDown size={16} className="shrink-0 text-neutral-500" />
                  ) : (
                    <ChevronRight size={16} className="shrink-0 text-neutral-500" />
                  )}
                  <Folder size={18} className="shrink-0 text-emerald-400" />
                  <span className="font-medium text-neutral-100">
                    {folderDateFormatter.format(group.date)}
                  </span>
                  <span className="text-sm text-neutral-500">
                    ({group.receipts.length}{" "}
                    {group.receipts.length === 1 ? "archivo" : "archivos"})
                  </span>
                </button>

                {isOpen && (
                  <ul className="divide-y divide-neutral-800 border-t border-neutral-800">
                    {group.receipts.map((receipt) => (
                      <li key={receipt.id} className="flex flex-col gap-1 px-4 py-2 pl-11">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm text-neutral-300">
                            <File size={15} className="shrink-0 text-neutral-500" />
                            {receipt.serieNumero}.xml
                            <span className="text-neutral-500">
                              — {receipt.razonSocial}
                            </span>
                          </span>
                          <span className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => openPreview(receipt)}
                              className="flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-neutral-200"
                            >
                              <Eye size={15} />
                              Vista previa
                            </button>
                            <a
                              href={getReceiptXMLUrl(receipt.id)}
                              className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
                            >
                              Descargar
                            </a>
                          </span>
                        </div>

                        {receipt.hasPdf && (
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm text-neutral-300">
                              <FileText size={15} className="shrink-0 text-neutral-500" />
                              {receipt.serieNumero}.pdf
                            </span>
                            <span className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => openPdfPreview(receipt)}
                                className="flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-neutral-200"
                              >
                                <Eye size={15} />
                                Vista previa
                              </button>
                              <a
                                href={getReceiptPDFUrl(receipt.id)}
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
                )}
              </div>
            );
          })}
        </div>
      )}

      {preview && (
        <XMLPreviewModal
          title={preview.title}
          content={previewContent}
          loading={previewLoading}
          error={previewError}
          onClose={closePreview}
        />
      )}

      {pdfPreview && (
        <PDFPreviewModal
          title={pdfPreview.title}
          url={pdfPreviewUrl}
          loading={pdfPreviewLoading}
          error={pdfPreviewError}
          onClose={closePdfPreview}
        />
      )}
    </div>
  );
}
