"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  Users,
  MessageSquare,
  Hand,
  Settings,
  Grid,
  Maximize,
  MoreVertical,
  Volume2,
  VolumeX,
  UserPlus,
  Copy,
  Clock,
  Circle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Mock participants
const mockParticipants = [
  { id: "1", name: "Dr. Sarah Johnson", role: "host", video: true, audio: true, speaking: false },
  { id: "2", name: "John Doe", role: "student", video: true, audio: true, speaking: true },
  { id: "3", name: "Jane Smith", role: "student", video: false, audio: true, speaking: false },
  { id: "4", name: "Mike Brown", role: "student", video: true, audio: false, speaking: false },
];

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [raisedHand, setRaisedHand] = useState(false);
  const [duration, setDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "John Doe", message: "Hello everyone!", time: "10:00 AM" },
    { id: 2, sender: "Jane Smith", message: "Hi! Can you hear me?", time: "10:01 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (confirm("Are you sure you want to leave the meeting?")) {
      router.push(`/dashboard/courses/${courseId}`);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: chatMessages.length + 1,
        sender: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setNewMessage("");
  };

  const meetingLink = `https://meet.lms.edu/${courseId}/meeting-${Date.now()}`;

  return (
    <div className="fixed inset-0 bg-neutral-900">
      {/* Main Video Area */}
      <div className="flex h-full">
        {/* Central Video Grid */}
        <div className={`relative flex-1 ${showParticipants || showChat ? "mr-0" : ""}`}>
          {/* Top Bar */}
          <div className="absolute left-0 right-0 top-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                  <Clock className="h-4 w-4" />
                  {formatDuration(duration)}
                </div>
                {isRecording && (
                  <div className="flex items-center gap-2 animate-pulse rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                    <Circle className="h-4 w-4 fill-white" />
                    Recording
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(meetingLink);
                    alert("Meeting link copied!");
                  }}
                  className="flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex h-full items-center justify-center p-4 pt-20 pb-32">
            <div className="grid h-full w-full max-w-7xl grid-cols-2 gap-4">
              {mockParticipants.map((participant) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative overflow-hidden rounded-2xl bg-neutral-800 ${
                    participant.speaking ? "ring-4 ring-green-500" : ""
                  }`}
                >
                  {participant.video ? (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50">
                      {/* Placeholder for video feed */}
                      <div className="text-6xl">👤</div>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                      <div className="text-center">
                        <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-4xl font-bold text-white">
                          {participant.name.charAt(0)}
                        </div>
                        <VideoOff className="mx-auto h-8 w-8 text-white/50" />
                      </div>
                    </div>
                  )}

                  {/* Participant Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{participant.name}</span>
                        {participant.role === "host" && (
                          <span className="rounded bg-purple-600 px-2 py-0.5 text-xs font-semibold text-white">
                            Host
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {participant.audio ? (
                          <Mic className="h-4 w-4 text-white" />
                        ) : (
                          <MicOff className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 to-transparent p-6">
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                    isVideoOn
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                  title={isVideoOn ? "Turn off camera" : "Turn on camera"}
                >
                  {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </button>

                <button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                    isAudioOn
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                  title={isAudioOn ? "Mute" : "Unmute"}
                >
                  {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </button>
              </div>

              {/* Center Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`flex h-14 items-center gap-2 rounded-full px-6 transition ${
                    isScreenSharing
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  title="Share screen"
                >
                  <Monitor className="h-5 w-5" />
                  {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                </button>

                <button
                  onClick={() => setRaisedHand(!raisedHand)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                    raisedHand
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  title="Raise hand"
                >
                  <Hand className="h-6 w-6" />
                </button>

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                    isRecording
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  <Circle className={`h-6 w-6 ${isRecording ? "fill-white" : ""}`} />
                </button>

                <button
                  onClick={handleEndCall}
                  className="flex h-14 items-center gap-2 rounded-full bg-red-600 px-6 text-white transition hover:bg-red-700"
                  title="Leave meeting"
                >
                  <PhoneOff className="h-5 w-5" />
                  Leave
                </button>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowParticipants(!showParticipants);
                    setShowChat(false);
                  }}
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                    showParticipants
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  title="Participants"
                >
                  <Users className="h-6 w-6" />
                </button>

                <button
                  onClick={() => {
                    setShowChat(!showChat);
                    setShowParticipants(false);
                  }}
                  className={`relative flex h-14 w-14 items-center justify-center rounded-full transition ${
                    showChat
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  title="Chat"
                >
                  <MessageSquare className="h-6 w-6" />
                  {chatMessages.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                      {chatMessages.length}
                    </span>
                  )}
                </button>

                <button
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  title="More options"
                >
                  <MoreVertical className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel (Participants or Chat) */}
        <AnimatePresence>
          {(showParticipants || showChat) && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-80 border-l border-white/10 bg-neutral-800 flex flex-col"
            >
              {showParticipants && (
                <div className="flex flex-col h-full">
                  <div className="border-b border-white/10 p-4">
                    <h3 className="font-bold text-white">Participants ({mockParticipants.length})</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                      {mockParticipants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between rounded-xl bg-white/5 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-sm font-bold text-white">
                              {participant.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-white">{participant.name}</div>
                              <div className="text-xs text-neutral-400">{participant.role}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {participant.audio ? (
                              <Mic className="h-4 w-4 text-green-500" />
                            ) : (
                              <MicOff className="h-4 w-4 text-red-500" />
                            )}
                            {participant.video ? (
                              <Video className="h-4 w-4 text-green-500" />
                            ) : (
                              <VideoOff className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/10 p-4">
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700">
                      <UserPlus className="h-5 w-5" />
                      Invite Others
                    </button>
                  </div>
                </div>
              )}

              {showChat && (
                <div className="flex flex-col h-full">
                  <div className="border-b border-white/10 p-4">
                    <h3 className="font-bold text-white">Chat</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-3">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="rounded-xl bg-white/5 p-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">{msg.sender}</span>
                            <span className="text-xs text-neutral-400">{msg.time}</span>
                          </div>
                          <p className="text-sm text-neutral-300">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/10 p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-neutral-400 focus:border-purple-500 focus:outline-none"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

