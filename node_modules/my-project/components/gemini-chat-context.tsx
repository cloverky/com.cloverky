"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export function nextChatId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function scrollChatLists(
  a: React.RefObject<HTMLDivElement | null>,
  b: React.RefObject<HTMLDivElement | null>,
) {
  requestAnimationFrame(() => {
    for (const ref of [a, b]) {
      const el = ref.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  });
}

type GeminiChatContextValue = {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  messagesRef: React.MutableRefObject<ChatMessage[]>;
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  dialogListRef: React.MutableRefObject<HTMLDivElement | null>;
  floatingListRef: React.MutableRefObject<HTMLDivElement | null>;
};

const GeminiChatContext = createContext<GeminiChatContextValue | null>(null);

export function GeminiChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesRef = useRef<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogListRef = useRef<HTMLDivElement | null>(null);
  const floatingListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const value = useMemo(
    () => ({
      messages,
      setMessages,
      messagesRef,
      input,
      setInput,
      loading,
      setLoading,
      error,
      setError,
      dialogListRef,
      floatingListRef,
    }),
    [messages, input, loading, error],
  );

  return <GeminiChatContext.Provider value={value}>{children}</GeminiChatContext.Provider>;
}

export function useGeminiChat() {
  const ctx = useContext(GeminiChatContext);
  if (!ctx) {
    throw new Error("useGeminiChat must be used within GeminiChatProvider");
  }
  return ctx;
}
