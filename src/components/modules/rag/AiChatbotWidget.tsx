"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Stethoscope,
  ChevronDown,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import {
  queryRagAction,
  ingestDoctorsAction,
  getUserRoleAction,
} from "@/src/app/_actions/rag.action";
import { IRagDoctorRecommendation } from "@/src/services/rag.services";

interface IChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  doctors?: IRagDoctorRecommendation[];
  sources?: string;
  timestamp: Date;
  isError?: boolean;
}

const SAMPLE_QUERIES = [
  "🧠 Neurologist in Dhaka",
  "🦷 Severe toothache & gum bleeding",
  "❤️ Best Cardiologist for chest pain",
  "👶 Experienced Pediatrician nearby",
  "👁️ Eye specialist for blurred vision",
];

export default function AiChatbotWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<IChatMessage[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      content:
        "Hello! 👋 I'm your HealthCare AI Assistant. How can I help you today? Describe your symptoms, medical needs, or ask for doctor recommendations.",
      timestamp: new Date(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check user role on mount
  useEffect(() => {
    let isMounted = true;
    const checkRole = async () => {
      try {
        const role = await getUserRoleAction();
        if (isMounted) {
          setUserRole(role);
        }
      } catch (e) {
        console.error("Failed to load user role", e);
      }
    };
    checkRole();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: IChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const response = await queryRagAction(query);

      if (response.success && response.answer) {
        const assistantMessage: IChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "assistant",
          content: response.answer,
          doctors: response.doctors,
          sources: response.sources,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: IChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: "assistant",
          content:
            response.error ||
            "I couldn't retrieve a response at the moment. Please try again.",
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error(err);
      const errorMessage: IChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "assistant",
        content:
          "An unexpected error occurred while communicating with the AI. Please check your connection.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "assistant",
        content:
          "Chat cleared! How else can I assist you with your healthcare inquiries?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleSyncDoctors = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const res = await ingestDoctorsAction();
      if (res.success) {
        setSyncStatus({
          type: "success",
          message: res.message || "Doctor vector embeddings synced successfully!",
        });
      } else {
        setSyncStatus({
          type: "error",
          message: res.error || "Failed to sync doctor data.",
        });
      }
    } catch (error) {
      setSyncStatus({
        type: "error",
        message: "Network error while syncing doctor data.",
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => {
        setSyncStatus(null);
      }, 5000);
    }
  };

  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[85vh] bg-background/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200 transition-all text-foreground"
          role="dialog"
          aria-label="HealthCare AI Assistant"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-primary/95 to-teal-600 text-primary-foreground px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shadow-inner">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-primary rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm leading-tight text-white">
                    HealthCare AI
                  </h3>
                  <span className="text-[10px] bg-white/20 text-white font-medium px-1.5 py-0.2 rounded-full backdrop-blur-xs">
                    RAG
                  </span>
                </div>
                <p className="text-[11px] text-white/80 leading-tight">
                  Doctor & Clinic Recommendation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Admin Sync Doctor Data Button */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleSyncDoctors}
                  disabled={isSyncing}
                  title="Admin Tool: Re-index Doctor Vector Database"
                  className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors flex items-center gap-1 text-xs disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline text-[11px] font-medium">
                    {isSyncing ? "Syncing..." : "Sync Vectors"}
                  </span>
                </button>
              )}

              {/* Clear chat */}
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Minimize */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Admin Sync Notification Alert */}
          {syncStatus && (
            <div
              className={`px-3 py-2 text-xs flex items-center justify-between border-b animate-in fade-in duration-150 ${
                syncStatus.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {syncStatus.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{syncStatus.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setSyncStatus(null)}
                className="hover:opacity-75 cursor-pointer ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/20 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-xs shadow-xs"
                      : msg.isError
                      ? "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-tl-xs"
                      : "bg-muted/70 text-foreground border border-border/60 rounded-tl-xs shadow-xs"
                  }`}
                >
                  {/* Doctor Cards View if available */}
                  {msg.doctors && msg.doctors.length > 0 ? (
                    <div className="space-y-2.5">
                      <p className="font-medium text-foreground/90">
                        {`I found ${msg.doctors.length} specialist${
                          msg.doctors.length > 1 ? "s" : ""
                        } for you:`}
                      </p>
                      <div className="space-y-2 pt-1">
                        {msg.doctors.map((doc, idx) => (
                          <div
                            key={idx}
                            className="bg-card border border-border/80 rounded-xl p-2.5 shadow-xs hover:border-primary/40 transition-colors text-foreground"
                          >
                            <div className="flex items-start gap-2">
                              <div className="p-1.5 rounded-lg bg-primary/10 text-primary mt-0.5">
                                <Stethoscope className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between gap-1">
                                  <h4 className="font-semibold text-xs text-foreground truncate">
                                    {doc.name || "Doctor"}
                                  </h4>
                                </div>
                                {doc.specialty && (
                                  <span className="inline-block px-1.5 py-0.5 mt-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground rounded">
                                    {doc.specialty}
                                  </span>
                                )}
                                {doc.reason && (
                                  <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-3">
                                    <strong className="text-foreground/80">
                                      Why:{" "}
                                    </strong>
                                    {doc.reason}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  )}

                  {/* Match score / source badge */}
                  {msg.sources && (
                    <div className="mt-2 pt-1.5 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        Vector Confidence
                      </span>
                      <span className="font-semibold text-primary">
                        {msg.sources}
                      </span>
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 mt-0.5 border border-border shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted/70 text-foreground border border-border/60 rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-xs flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Searching doctor vector database...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-3 py-2 bg-muted/40 border-t border-border/50">
              <p className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                Sample Queries:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_QUERIES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(sample)}
                    className="text-[11px] bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border/80 text-foreground/80 px-2 py-1 rounded-full transition-all text-left truncate max-w-full cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-background border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question or search for a doctor..."
                  disabled={isLoading}
                  className="w-full bg-muted/60 text-foreground placeholder:text-muted-foreground text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer flex items-center justify-center shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground px-0.5">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-2.5 h-2.5" />
                AI doctor recommendations
              </span>
              <span>Emergency? Dial 999/911</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-primary via-primary to-teal-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/30"
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {/* Glowing pulse ring */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-teal-400 opacity-60 blur-xs group-hover:opacity-100 transition duration-500 animate-pulse" />

        <div className="relative z-10 flex items-center justify-center">
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200 rotate-0 group-hover:rotate-90" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
              </span>
            </>
          )}
        </div>

        {/* Hover Tooltip when closed */}
        {!isOpen && (
          <span className="pointer-events-none absolute right-full mr-3 hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium shadow-lg border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Ask Doctor AI
          </span>
        )}
      </button>
    </div>
  );
}
