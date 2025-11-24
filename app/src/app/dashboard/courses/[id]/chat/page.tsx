"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Search,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Users,
  Pin,
  Bell,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock conversations
const mockConversations = [
  {
    id: "1",
    name: "Course General",
    type: "group",
    members: 45,
    lastMessage: "Don't forget about the assignment due tomorrow!",
    lastTime: "2 min ago",
    unread: 5,
    online: true,
    pinned: true,
  },
  {
    id: "2",
    name: "Project Team A",
    type: "group",
    members: 5,
    lastMessage: "John: I've pushed the latest changes",
    lastTime: "10 min ago",
    unread: 2,
    online: true,
    pinned: false,
  },
  {
    id: "3",
    name: "Teaching Assistant",
    type: "direct",
    members: 1,
    lastMessage: "Sure, I can help with that!",
    lastTime: "1 hour ago",
    unread: 0,
    online: true,
    pinned: false,
  },
  {
    id: "4",
    name: "Study Group",
    type: "group",
    members: 8,
    lastMessage: "Meeting at 3 PM in the library",
    lastTime: "2 hours ago",
    unread: 0,
    online: false,
    pinned: false,
  },
];

// Mock messages
const mockMessages = [
  {
    id: 1,
    sender: "Dr. Sarah Johnson",
    avatar: "SJ",
    message: "Hello class! Welcome to today's discussion.",
    time: "10:00 AM",
    isOwn: true,
  },
  {
    id: 2,
    sender: "John Doe",
    avatar: "JD",
    message: "Good morning professor! Thank you for the materials.",
    time: "10:02 AM",
    isOwn: false,
  },
  {
    id: 3,
    sender: "Jane Smith",
    avatar: "JS",
    message: "I have a question about the assignment.",
    time: "10:05 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "Dr. Sarah Johnson",
    avatar: "SJ",
    message: "Sure Jane! What would you like to know?",
    time: "10:06 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "Jane Smith",
    avatar: "JS",
    message: "Could you clarify the deadline for part 2?",
    time: "10:07 AM",
    isOwn: false,
  },
  {
    id: 6,
    sender: "Dr. Sarah Johnson",
    avatar: "SJ",
    message: "The deadline is next Friday at 11:59 PM. Make sure to submit via the portal.",
    time: "10:08 AM",
    isOwn: true,
  },
];

export default function CourseChatPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [selectedChat, setSelectedChat] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: "Dr. Sarah Johnson",
      avatar: "SJ",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <main className="relative z-10 px-4 py-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => router.push(`/dashboard/courses/${courseId}`)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-purple-600 dark:text-neutral-400 dark:hover:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </button>
          </div>

          {/* Chat Interface */}
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm dark:border-white/10 dark:bg-white/5" style={{ height: "calc(100vh - 200px)" }}>
            <div className="flex h-full">
              {/* Conversations Sidebar */}
              <AnimatePresence>
                {showSidebar && (
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    className="w-80 border-r border-white/10 bg-white/5 dark:bg-white/5"
                  >
                    <div className="flex h-full flex-col">
                      {/* Search */}
                      <div className="border-b border-white/10 p-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                          />
                        </div>
                      </div>

                      {/* Conversations List */}
                      <div className="flex-1 overflow-y-auto p-2">
                        {filteredConversations.map((conv) => (
                          <button
                            key={conv.id}
                            onClick={() => setSelectedChat(conv)}
                            className={`relative mb-2 w-full rounded-xl p-3 text-left transition ${
                              selectedChat.id === conv.id
                                ? "bg-purple-600/20 ring-2 ring-purple-600/50"
                                : "hover:bg-white/10"
                            }`}
                          >
                            {conv.pinned && (
                              <Pin className="absolute right-2 top-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                            )}
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-sm font-bold text-white">
                                  {conv.type === "group" ? <Users className="h-6 w-6" /> : conv.name.charAt(0)}
                                </div>
                                {conv.online && (
                                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-neutral-900" />
                                )}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className="mb-1 flex items-center justify-between">
                                  <span className="font-semibold text-neutral-900 dark:text-white">
                                    {conv.name}
                                  </span>
                                  {conv.unread > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                                      {conv.unread}
                                    </span>
                                  )}
                                </div>
                                <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                                  {conv.lastMessage}
                                </p>
                                <p className="mt-1 text-xs text-neutral-500">{conv.lastTime}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Area */}
              <div className="flex flex-1 flex-col">
                {/* Chat Header */}
                <div className="border-b border-white/10 bg-white/5 p-4 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20 lg:hidden"
                      >
                        <Users className="h-5 w-5" />
                      </button>
                      <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white">{selectedChat.name}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {selectedChat.type === "group"
                            ? `${selectedChat.members} members`
                            : "Online"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20">
                        <Video className="h-5 w-5" />
                      </button>
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20">
                        <Bell className="h-5 w-5" />
                      </button>
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-sm font-bold text-white">
                          {msg.avatar}
                        </div>
                        <div className={`max-w-md ${msg.isOwn ? "text-right" : ""}`}>
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                              {msg.sender}
                            </span>
                            <span className="text-xs text-neutral-500">{msg.time}</span>
                          </div>
                          <div
                            className={`rounded-2xl p-4 ${
                              msg.isOwn
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                : "border border-white/10 bg-white/10 text-neutral-900 dark:text-white"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="border-t border-white/10 bg-white/5 p-4 dark:bg-white/5">
                  <div className="flex items-end gap-3">
                    <div className="flex gap-2">
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20">
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20">
                        <ImageIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                      />
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20">
                      <Smile className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      <Send className="h-5 w-5" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

