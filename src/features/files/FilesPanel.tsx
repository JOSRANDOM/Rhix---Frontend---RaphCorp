import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Eye, File, Folder } from "lucide-react";
import { getReceipts, getReceiptXMLUrl, type Receipt } from "@/lib/receipts";
import { XMLPreviewModal } from "@/components/XMLPreviewModal";

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
  const [error, setError] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  const [preview, setPreview] = useState<{ id: number; title: string } | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getReceipts()
      .then((data) => {
        if (cancelled) return;
        setReceipts(data);
        const groups = groupByReceivedDate(data);
        if (groups.length > 0) setOpenFolders(new Set([groups[0].key]));
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

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-white">Archivos</h1>
        <p className="text-sm text-neutral-400">
          XML originales recibidos, agrupados por fecha
        </p>
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
                      <li
                        key={receipt.id}
                        className="flex items-center justify-between px-4 py-2 pl-11"
                      >
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
    </div>
  );
}
