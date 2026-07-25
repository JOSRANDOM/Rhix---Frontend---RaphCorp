import { X } from "lucide-react";

interface PDFPreviewModalProps {
  title: string;
  url: string | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function PDFPreviewModal({
  title,
  url,
  loading,
  error,
  onClose,
}: PDFPreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[85vh] w-full max-w-3xl flex-col rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <h2 className="text-sm font-medium text-neutral-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {loading && <p className="p-4 text-sm text-neutral-400">Cargando...</p>}

          {!loading && error && <p className="p-4 text-sm text-red-400">{error}</p>}

          {!loading && !error && url && (
            <iframe src={url} title={title} className="h-full w-full bg-neutral-100" />
          )}
        </div>
      </div>
    </div>
  );
}
