import { X } from "lucide-react";

interface XMLPreviewModalProps {
  title: string;
  content: string | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function XMLPreviewModal({
  title,
  content,
  loading,
  error,
  onClose,
}: XMLPreviewModalProps) {
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
          <h2 className="text-sm font-medium text-neutral-100">{title}</h2>
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

          {!loading && !error && content != null && (
            <pre className="overflow-x-auto text-xs whitespace-pre-wrap text-neutral-300">
              {content}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
