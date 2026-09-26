import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { MessageCircleIcon, SendIcon, XIcon, Loader2Icon, Sprout } from "lucide-react";
import api from "../config/api";
import { useAuth } from "../context/authContext";
import { errorMessage } from "../utils/errorMessage";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Where's my order?",
  "How do I use a coupon?",
  "What's your cancellation policy?",
  "How much is delivery?",
];

// Only what the server needs, and bounded so a long chat can't balloon the request forever.
const toHistory = (messages: ChatMessage[]) => messages.slice(-12);

/**
 * Floating support chat, available on every page. Talks to POST /api/chat, which is
 * powered by Claude on the server and knows this store's policies. If the store hasn't
 * configured an API key yet, it fails gracefully with a clear message instead of breaking.
 */
export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, sending]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const { data } = await api.post("/chat", { message: trimmed, history: toHistory(messages) });
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 503) {
        setUnavailable(true);
      } else {
        setMessages([
          ...next,
          { role: "assistant", content: errorMessage(error, "Sorry, something went wrong. Please try again.") },
        ]);
      }
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close support chat" : "Open support chat"}
        className="fixed bottom-5 right-5 z-40 size-14 rounded-full bg-app-green text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <XIcon className="size-6" /> : <MessageCircleIcon className="size-6" />}
      </button>

      {/* Window */}
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm h-[70vh] max-h-[560px] bg-white rounded-3xl shadow-2xl border border-zinc-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-app-green text-white px-5 py-4 flex items-center gap-2">
            <Sprout className="size-5" />
            <div>
              <p className="font-semibold leading-tight">Instacart Support</p>
              <p className="text-xs text-white/80 leading-tight">Usually replies in seconds</p>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-50">
            {unavailable ? (
              <p className="text-sm text-zinc-500 bg-white rounded-2xl p-4 border border-zinc-100">
                Chat support isn't available right now. Please reach out to our support team another way, or try
                again later.
              </p>
            ) : (
              <>
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-500 bg-white rounded-2xl p-4 border border-zinc-100">
                      Hi{user?.name ? ` ${user.name.split(" ")[0]}` : ""}! I'm the Instacart support assistant. Ask
                      me about your order, coupons, delivery, or anything else about shopping here.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((q) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          className="text-xs px-3 py-1.5 rounded-full border border-app-green/30 text-app-green bg-white hover:bg-app-green/5"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-app-green text-white rounded-br-sm"
                          : "bg-white text-zinc-800 border border-zinc-100 rounded-bl-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-zinc-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                      <Loader2Icon className="size-4 animate-spin text-zinc-400" />
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {!unavailable && (
            <form onSubmit={onSubmit} className="p-3 border-t border-zinc-100 flex items-center gap-2 bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                maxLength={2000}
                disabled={sending}
                className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-zinc-100 outline-none text-sm disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Send message"
                className="size-10 shrink-0 rounded-full bg-app-green text-white flex items-center justify-center disabled:opacity-40"
              >
                <SendIcon className="size-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
