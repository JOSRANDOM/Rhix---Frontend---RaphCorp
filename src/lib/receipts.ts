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
