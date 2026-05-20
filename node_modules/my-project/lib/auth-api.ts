/** FastAPI 인증 API */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

type FastApiErrorBody = { detail?: string | { msg?: string }[] };

function parseApiError(data: FastApiErrorBody, status: number): string {
  const { detail } = data;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg ?? JSON.stringify(d)).join("\n");
  }
  return `요청 실패 (${status})`;
}

export type SignUpPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
};

export type SignUpResponse = { message: string; username: string; email: string };

export async function postSignUp(payload: SignUpPayload): Promise<SignUpResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        username: payload.username,
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
        agreeTerms: payload.agreeTerms,
      }),
    });
  } catch {
    throw new Error(
      "백엔드 서버에 연결할 수 없습니다. uvicorn이 실행 중인지 확인해 주세요.",
    );
  }

  const data = (await res.json()) as SignUpResponse & FastApiErrorBody;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  return data;
}

export type UsernameCheckResult = {
  username: string;
  available: boolean;
  message: string;
};

const CHECK_USERNAME_TIMEOUT_MS = 10_000;

export async function checkUsername(username: string): Promise<UsernameCheckResult> {
  const params = new URLSearchParams({ username: username.trim() });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHECK_USERNAME_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/signup/check-username?${params}`, {
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("서버 응답이 너무 느립니다. 백엔드를 재시작한 뒤 다시 시도해 주세요.");
    }
    throw new Error(
      "백엔드 서버에 연결할 수 없습니다. uvicorn이 실행 중인지 확인해 주세요.",
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const data = (await res.json()) as UsernameCheckResult & FastApiErrorBody;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  return data;
}

export type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

export type LoginResponse = {
  message: string;
  name: string;
  username: string;
  email: string;
};

export async function postLogin(payload: LoginPayload): Promise<LoginResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        remember: payload.remember ?? false,
      }),
    });
  } catch {
    throw new Error(
      "백엔드 서버에 연결할 수 없습니다. uvicorn이 실행 중인지 확인해 주세요.",
    );
  }

  const data = (await res.json()) as LoginResponse & FastApiErrorBody;

  if (!res.ok) {
    throw new Error(parseApiError(data, res.status));
  }

  return data;
}
