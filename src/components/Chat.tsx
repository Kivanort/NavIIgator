"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "./Button";

interface Message {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

function getProfileAnswersString(
  profile: ReturnType<typeof useApp>["profile"]
): string {
  const hobbies =
    profile.hobbies.length > 0 ? profile.hobbies.join(", ") : "Нет";
  return [
    profile.name || "Гость",
    profile.age || "Не указан",
    profile.techLevel || "Не указан",
    profile.profession || "Не указана",
    hobbies,
    profile.tourTime || "Не указано",
    profile.style === "formal" ? "Формальный" : "Неформальный",
  ].join("\n");
}

export function Chat() {
  const { profile } = useApp();
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<"pending" | "personalized" | "generic">(
    profile.name ? "personalized" : "pending"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (chatMode === "pending") return;
    try {
      const stored = localStorage.getItem("chatHistory");
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        if (parsed.length > 0) {
          setMessages(parsed.filter((m) => !m.error));
          return;
        }
      }
    } catch { /* ignore */ }
    if (messages.length === 0) {
      const greeting =
        chatMode === "generic"
          ? profile.style === "formal"
            ? `Здравствуйте! Я ваш AI-гид по Яндекс Музее. Чем могу помочь?`
            : `Привет! Я твой AI-гид по Яндекс Музее. Задавай вопросы или попроси подобрать маршрут!`
          : profile.style === "formal"
            ? `Здравствуйте, ${profile.name}! Я ваш AI-гид по Яндекс Музее. Чем могу помочь?`
            : `Привет, ${profile.name}! Я твой AI-гид по Яндекс Музее. Задавай вопросы или попроси подобрать маршрут!`;
      setMessages([{ role: "assistant", content: greeting }]);
    }
  }, [chatMode, profile.name, profile.style, messages.length]);

  useEffect(() => {
    if (chatMode === "pending" || messages.length === 0) return;
    const toStore = messages.filter((m) => !m.error);
    if (toStore.length > 0) {
      try { localStorage.setItem("chatHistory", JSON.stringify(toStore.slice(-50))); } catch { /* ignore */ }
    }
  }, [messages, chatMode]);

  const sendMessage = useCallback(async (retryText?: string) => {
    const text = retryText ?? input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!retryText) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.filter((m) => !m.error && m.content).slice(-30),
          profileAnswers: getProfileAnswersString(profile),
          language: lang,
        }),
      });

      if (!res.ok) {
        let detail = "";
        try {
          const body = await res.json();
          detail = body.error || "";
        } catch {
          // non-json
        }
        if (res.status === 429) {
          throw new Error("Слишком много запросов. Подождите минуту и попробуйте снова.");
        }
        throw new Error(detail || `Ошибка AI-сервиса (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      setMessages([...updatedMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              assistantContent += parsed.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            // skip malformed JSON lines
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg =
        profile.style === "formal"
          ? `Не удалось получить ответ от AI. Попробуйте позже.`
          : `Не удалось получить ответ от AI. Попробуй позже!`;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: errorMsg,
            error: true,
          };
          return updated;
        }
        return [...prev, { role: "assistant", content: errorMsg, error: true }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, profile, lang]);

  const handleRetry = useCallback(
    (failedText: string) => {
      setMessages((prev) => prev.filter((m) => !m.error));
      sendMessage(failedText);
    },
    [sendMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (chatMode === "pending") {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-8 text-center shadow-card dark:shadow-dark-card transition-colors duration-300">
          <span className="mb-4 inline-block text-4xl">🤖</span>
          <h2 className="text-xl font-extrabold dark:text-dark-text">{t("chat.quizPrompt")}</h2>
          <p className="mt-2 text-sm text-yandex-gray-500 dark:text-dark-muted">
            {t("chat.quizPromptHint")}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/quiz">
              <Button>{t("chat.quizPromptCta")}</Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setChatMode("generic");
              }}
            >
              {t("chat.continueWithoutQuiz")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-yandex-red text-white shadow-md shadow-yandex-red/20"
                      : msg.error
                        ? "border border-red-400/50 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300"
                        : "bg-yandex-gray-100 dark:bg-dark-card text-yandex-dark dark:text-dark-text border border-transparent dark:border-dark-border/30"
                  }`}
                >
                  {msg.role === "assistant" && !msg.error && (
                    <span className="mr-2 inline-block text-base">
                      🤖
                    </span>
                  )}
                  {msg.error && (
                    <span className="mr-2 inline-block text-base">⚠️</span>
                  )}
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                  {msg.error && (
                    <button
                      type="button"
                      onClick={() => {
                        const userMsg = messages
                          .slice(0, i)
                          .reverse()
                          .find((m) => m.role === "user");
                        if (userMsg) handleRetry(userMsg.content);
                      }}
                      disabled={isLoading}
                      className="mt-2 block rounded-lg border border-red-300 dark:border-red-500/30 bg-white dark:bg-dark-input px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {t("chat.retry")}
                    </button>
                  )}
                  {msg.role === "assistant" &&
                    !msg.error &&
                    isLoading &&
                    i === messages.length - 1 &&
                    !msg.content && (
                      <span className="ml-1 inline-block animate-pulse">
                        ...
                      </span>
                    )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-yandex-gray-200 dark:border-dark-border/40 bg-white dark:bg-dark-bg px-4 py-4 transition-colors duration-300">
        <div className="mx-auto flex max-w-2xl items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.placeholder")}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-yandex-gray-200 dark:border-dark-border bg-yandex-gray-50 dark:bg-dark-card px-4 py-3 text-sm text-yandex-dark dark:text-dark-text outline-none transition-colors duration-200 focus:border-yandex-red focus:ring-2 focus:ring-yandex-red/20"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="shrink-0"
          >
            {isLoading ? "..." : t("chat.send")}
          </Button>
        </div>
      </div>
    </div>
  );
}
