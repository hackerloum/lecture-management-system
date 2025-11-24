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
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock conversations data
const conversations = [
  {
    id: 1,
    name: "Emily Chen",
    avatar: "EC",
    lastMessage: "Thank you for the feedback on my assignment!",
    timestamp: "2 min ago",
    unread: 2,
    online: true,
    type: "student",
  },
  {
    id: 2,
    name: "CS 101 Group",
    avatar: "CS",
    lastMessage: "Dr. Smith: Quiz results are now available",
    timestamp: "15 min ago",
    unread: 5,
    online: false,
    type: "group",
  },
  {
    id: 3,
    name: "David Lee",
    avatar: "DL",
    lastMessage: "Can we schedule a meeting to discuss the project?",
    timestamp: "1 hour ago",
    unread: 0,
    online: true,
    type: "student",
  },
  {
    id: 4,
    name: "Dr. Johnson",
    avatar: "DJ",
    lastMessage: "Please review the curriculum updates",
    timestamp: "2 hours ago",
    unread: 1,
    online: false,
    type: "faculty",
  },
  {
    id: 5,
    name: "Sarah Johnson",
    avatar: "SJ",
    lastMessage: "I have a question about the midterm exam",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
    type: "student",
  },
  {
    id: 6,
    name: "Mike Brown",
    avatar: "MB",
    lastMessage: "Could you explain the last lecture again?",
    timestamp: "2 days ago",
    unread: 0,
    online: false,
    type: "student",
  },
];

// Mock messages for selected conversation
const messages = [
  {
    id: 1,
    sender: "Emily Chen",
    content: "Hi Professor, I just submitted my assignment. Could you please review it when you get a chance?",
    timestamp: "10:30 AM",
    isOwn: false,
    read: true,
  },
  {
    id: 2,
    sender: "You",
    content: "Hi Emily! I'll review it today and provide feedback by tomorrow morning.",
    timestamp: "10:35 AM",
    isOwn: true,
    read: true,
  },
  {
    id: 3,
    sender: "Emily Chen",
    content: "That would be great, thank you!",
    timestamp: "10:36 AM",
    isOwn: false,
    read: true,
  },
  {
    id: 4,
    sender: "You",
    content: "I've reviewed your assignment. Great work on the algorithm implementation! I left some comments for improvement in the code structure.",
    timestamp: "2:15 PM",
    isOwn: true,
    read: true,
  },
  {
    id: 5,
    sender: "Emily Chen",
    content: "Thank you for the feedback on my assignment!",
    timestamp: "Just now",
    isOwn: false,
    read: false,
  },
];

export default function MessagesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "student":
        return "from-blue-500 to-cyan-500";
      case "faculty":
        return "from-purple-500 to-pink-500";
      case "group":
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
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`flex w-full items-start gap-3 border-b border-white/5 p-4 text-left transition hover:bg-white/5 ${
                      selectedConversation.id === conv.id ? "bg-white/10" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getTypeColor(conv.type)} text-sm font-bold text-white`}>
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-neutral-900" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {conv.name}
                        </span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {conv.timestamp}
                        </span>
                      </div>
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
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col lg:col-span-2">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${getTypeColor(selectedConversation.type)} text-sm font-bold text-white`}>
                    {selectedConversation.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      {selectedConversation.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                      {selectedConversation.online ? (
                        <>
                          <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                          Online
                        </>
                      ) : (
                        <>Last seen {selectedConversation.timestamp}</>
                      )}
                    </div>
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
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${message.isOwn ? "order-2" : "order-1"}`}>
                      {!message.isOwn && (
                        <div className="mb-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          {message.sender}
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.isOwn
                            ? "rounded-br-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "rounded-bl-sm border border-white/10 bg-white/10 text-neutral-900 dark:text-white"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                        <span>{message.timestamp}</span>
                        {message.isOwn && (
                          <>
                            {message.read ? (
                              <CheckCheck className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                          // Handle send message
                          setMessageInput("");
                        }
                      }}
                    />
                  </div>
                  <button
                    disabled={!messageInput.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

