export type ReceiptStatus = "pending" | "processed" | "failed";

export interface Receipt {
  id: number;
  ruc: string;
  razonSocial: string;
  serieNumero: string;
  fechaEmision: string;
  montoNeto: number;
  retencion?: number;
  status: ReceiptStatus;
  errorMessage?: string;
  emailMessageId: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function getReceipts(): Promise<Receipt[]> {
  const res = await fetch(`${API_URL}/api/receipts`);
  if (!res.ok) {
    throw new Error(`Error ${res.status} al obtener los recibos`);
  }
  const data: Receipt[] | null = await res.json();
  return data ?? [];
}

// Navegación directa (no fetch): el servidor responde con
// Content-Disposition: attachment, así que el navegador lo descarga en vez
// de navegar. Al ser una navegación y no un fetch/XHR, no aplican las
// restricciones de CORS aunque la API esté en otro origen.
export function getReceiptsExportUrl(): string {
  return `${API_URL}/api/receipts/export`;
}

export function getReceiptXMLUrl(id: number): string {
  return `${API_URL}/api/receipts/${id}/xml`;
}

export interface ReceiptEmailAttachment {
  id: number;
  serieNumero: string;
}

export interface ReceiptEmail {
  from: string;
  to: string;
  cc?: string;
  subject: string;
  body: string;
  attachments: ReceiptEmailAttachment[];
}

export async function getReceiptEmail(id: number): Promise<ReceiptEmail> {
  const res = await fetch(`${API_URL}/api/receipts/${id}/email`);
  if (!res.ok) {
    throw new Error(`Error ${res.status} al obtener el correo`);
  }
  return res.json();
}
