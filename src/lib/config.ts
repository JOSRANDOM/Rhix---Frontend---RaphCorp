const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export interface PlatformConfig {
  imapUser: string;
}

export async function getPlatformConfig(): Promise<PlatformConfig> {
  const res = await fetch(`${API_URL}/api/config`);
  if (!res.ok) {
    throw new Error(`Error ${res.status} al obtener la configuración`);
  }
  return res.json();
}
