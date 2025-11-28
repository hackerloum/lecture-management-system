"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Star,
  Check,
  CheckCheck,
  Circle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  course_id: string | null;
  subject: string | null;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role: string;
  };
  recipient?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role: string;
  };
  course?: {
    id: string;
    code: string;
    name: string;
  };
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  courseId: string | null;
  courseName: string | null;
}

export default function MessagesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations and messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Not authenticated");
        }
        setCurrentUserId(user.id);

        // Fetch all messages where user is sender or recipient
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, role),
            recipient:profiles!messages_recipient_id_fkey(id, full_name, avatar_url, role),
            course:courses(id, code, name)
          `)
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order("created_at", { ascending: false });

        if (messagesError) {
          console.error("Messages error:", messagesError);
          throw new Error("Failed to fetch messages");
        }

        // Group messages into conversations
        const conversationMap = new Map<string, Conversation>();
        const unreadCountMap = new Map<string, number>();

        messagesData?.forEach((msg: Message) => {
          // Determine the other user in the conversation
          const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
          const otherUser = msg.sender_id === user.id ? msg.recipient : msg.sender;

          if (!otherUserId || !otherUser) return;

          const convKey = otherUserId;
          
          // Count unread messages
          if (msg.recipient_id === user.id && !msg.is_read) {
            unreadCountMap.set(convKey, (unreadCountMap.get(convKey) || 0) + 1);
          }

          // Create or update conversation
          if (!conversationMap.has(convKey)) {
            const initials = otherUser.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            conversationMap.set(convKey, {
              id: convKey,
              userId: otherUserId,
              userName: otherUser.full_name,
              userAvatar: initials,
              userRole: otherUser.role,
              lastMessage: msg.content,
              lastMessageTime: msg.created_at,
              unread: 0,
              courseId: msg.course_id,
              courseName: msg.course ? `${msg.course.code}: ${msg.course.name}` : null,
            });
          } else {
            const conv = conversationMap.get(convKey)!;
            // Update if this message is more recent
            if (new Date(msg.created_at) > new Date(conv.lastMessageTime)) {
              conv.lastMessage = msg.content;
              conv.lastMessageTime = msg.created_at;
            }
          }
        });

        // Set unread counts
        unreadCountMap.forEach((count, convKey) => {
          const conv = conversationMap.get(convKey);
          if (conv) conv.unread = count;
        });

        const conversationsList = Array.from(conversationMap.values()).sort(
          (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );

        setConversations(conversationsList);
        
        // Select first conversation if available
        if (conversationsList.length > 0 && !selectedConversation) {
          setSelectedConversation(conversationsList[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    async function fetchConversationMessages() {
      if (!selectedConversation || !currentUserId) return;

      try {
        const supabase = createSupabaseBrowserClient();

        // Fetch messages between current user and selected conversation user
        // We need to get messages where:
        // 1. current user is sender and selected user is recipient, OR
        // 2. selected user is sender and current user is recipient
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, role),
            recipient:profiles!messages_recipient_id_fkey(id, full_name, avatar_url, role),
            course:courses(id, code, name)
          `)
          .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
          .order("created_at", { ascending: true });

        // Filter messages to only include those between current user and selected conversation user
        const filteredMessages = messagesData?.filter(
          (msg) =>
            (msg.sender_id === currentUserId && msg.recipient_id === selectedConversation.userId) ||
            (msg.sender_id === selectedConversation.userId && msg.recipient_id === currentUserId)
        ) || [];

        if (messagesError) {
          console.error("Messages error:", messagesError);
          return;
        }

        setMessages(filteredMessages);

        // Mark messages as read
        const unreadMessages = filteredMessages.filter(
          (msg) => msg.recipient_id === currentUserId && !msg.is_read
        );

        if (unreadMessages.length > 0) {
          const messageIds = unreadMessages.map((msg) => msg.id);
          await supabase
            .from("messages")
            .update({ is_read: true, read_at: new Date().toISOString() })
            .in("id", messageIds);

          // Update conversation unread count
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === selectedConversation.id ? { ...conv, unread: 0 } : conv
            )
          );
        }

        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (err) {
        console.error("Error fetching conversation messages:", err);
      }
    }

    fetchConversationMessages();
  }, [selectedConversation, currentUserId]);

  const filteredConversations = conversations.filter((conv) =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !currentUserId || sending) return;

    try {
      setSending(true);
      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUserId,
          recipient_id: selectedConversation.userId,
          course_id: selectedConversation.courseId,
          content: messageInput.trim(),
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, role),
          recipient:profiles!messages_recipient_id_fkey(id, full_name, avatar_url, role),
          course:courses(id, code, name)
        `)
        .single();

      if (error) {
        console.error("Error sending message:", error);
        return;
      }

      // Add message to local state
      setMessages((prev) => [...prev, data as Message]);
      setMessageInput("");

      // Update conversation last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: data.content,
                lastMessageTime: data.created_at,
              }
            : conv
        )
      );

      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getTypeColor = (role: string) => {
    switch (role) {
      case "student":
        return "from-blue-500 to-cyan-500";
      case "lecturer":
      case "admin":
        return "from-purple-500 to-pink-500";
      case "ta":
        return "from-green-500 to-emerald-500";
      default:
        return "from-neutral-500 to-neutral-600";
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
      <DashboardNavigation />
      
      {/* Static Background Elements */}
      <div className="fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-950/20" />
      </div>

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 dark:opacity-10"
        aria-hidden
      />

      <main className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
              Messages 💬
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Communicate with students and colleagues
            </p>
          </motion.div>

          {/* Messages Container */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid h-[calc(100vh-16rem)] overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 lg:grid-cols-3"
          >
            {/* Conversations Sidebar */}
            <div className="flex flex-col border-r border-white/10 lg:col-span-1">
              {/* Search */}
              <div className="border-b border-white/10 p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Loading conversations...</div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">No conversations yet</div>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`flex w-full items-start gap-3 border-b border-white/5 p-4 text-left transition hover:bg-white/5 ${
                        selectedConversation?.id === conv.id ? "bg-white/10" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getTypeColor(conv.userRole)} text-sm font-bold text-white`}>
                          {conv.userAvatar}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {conv.userName}
                          </span>
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            {formatTimestamp(conv.lastMessageTime)}
                          </span>
                        </div>
                        {conv.courseName && (
                          <div className="mb-1 text-xs text-neutral-500 dark:text-neutral-500">
                            {conv.courseName}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm text-neutral-600 dark:text-neutral-400">
                            {conv.lastMessage}
                          </p>
                          {conv.unread > 0 && (
                            <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col lg:col-span-2">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${getTypeColor(selectedConversation.userRole)} text-sm font-bold text-white`}>
                        {selectedConversation.userAvatar}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {selectedConversation.userName}
                        </div>
                        {selectedConversation.courseName && (
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {selectedConversation.courseName}
                          </div>
                        )}
                      </div>
                    </div>
                <div className="flex items-center gap-2">
                  <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-neutral-600 transition hover:bg-white/20 dark:text-neutral-400">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-neutral-600 transition hover:bg-white/20 dark:text-neutral-400">
                    <Video className="h-4 w-4" />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-neutral-600 transition hover:bg-white/20 dark:text-neutral-400">
                    <Star className="h-4 w-4" />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-neutral-600 transition hover:bg-white/20 dark:text-neutral-400">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    {messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          No messages yet. Start the conversation!
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwn = message.sender_id === currentUserId;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                              {!isOwn && message.sender && (
                                <div className="mb-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                  {message.sender.full_name}
                                </div>
                              )}
                              <div
                                className={`rounded-2xl px-4 py-3 ${
                                  isOwn
                                    ? "rounded-br-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                    : "rounded-bl-sm border border-white/10 bg-white/10 text-neutral-900 dark:text-white"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                                <span>{formatMessageTime(message.created_at)}</span>
                                {isOwn && (
                                  <>
                                    {message.is_read ? (
                                      <CheckCheck className="h-3 w-3 text-blue-500" />
                                    ) : (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-white/10 p-4">
                    <div className="flex items-end gap-2">
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-neutral-600 transition hover:bg-white/20 dark:text-neutral-400">
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 transition focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/20">
                        <textarea
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Type your message..."
                          rows={1}
                          className="w-full resize-none bg-transparent px-4 py-3 text-sm focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={sending}
                        />
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || sending}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      Select a conversation
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Choose a conversation from the list to start messaging
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

