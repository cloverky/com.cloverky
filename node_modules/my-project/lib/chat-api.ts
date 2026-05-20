/** FastAPI 백엔드 (Swagger: POST /chat) */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

type ChatApiResponse = { reply: string };
type FastApiErrorBody = { detail?: string | { msg?: string }[] };

function parseApiError(data: FastApiErrorBody, status: number): string {
  const { detail } = data;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg ?? JSON.stringify(d)).join("\n");
  }
  return `요청 실패 (${status})`;
}

/** 백엔드 POST /chat — 본문: { "message": "..." }, 응답: { "reply": "..." } */
export async function postBackendChat(message: string): Promise<string> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = (await res.json()) as ChatApiResponse & FastApiErrorBody;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  const reply = data.reply?.trim();
  if (!reply) {
    throw new Error("응답이 비어 있습니다.");
  }

  return reply;
}
