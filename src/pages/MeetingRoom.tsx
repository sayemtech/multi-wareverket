import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  PhoneOff,
  Users,
  MessageSquare,
  Settings,
  HandMetal,
  MoreHorizontal,
  PanelRight,
  PanelRightClose,
} from "lucide-react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { getMeetingById, updateMeetingStatus } from "@/lib/meetings";

export default function MeetingRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (!id) {
      toast.error("Meeting ID not found");
      navigate("/settings");
      return;
    }

    const meetingData = getMeetingById(id);
    if (!meetingData) {
      toast.error("Meeting not found");
      navigate("/settings");
      return;
    }

    setMeeting(meetingData);
    setParticipants([meetingData.createdBy, ...meetingData.participants.slice(0, 5)]);
    setIsLoading(false);
  }, [id, navigate]);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast.info(`Microphone ${audioEnabled ? "muted" : "unmuted"}`);
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    toast.info(`Camera ${videoEnabled ? "turned off" : "turned on"}`);
  };

  const toggleScreenShare = () => {
    setScreenShareEnabled(!screenShareEnabled);
    toast.info(`Screen sharing ${screenShareEnabled ? "stopped" : "started"}`);
  };

  const toggleRaiseHand = () => {
    setHandRaised(!handRaised);
    toast.info(`Hand ${handRaised ? "lowered" : "raised"}`);
  };

  const endCall = () => {
    if (id) {
      updateMeetingStatus(id, 'completed');
      toast.success("Meeting ended");
      navigate("/settings");
    }
  };

  // Mock function for generating fake participants for the demo
  const generateMockParticipants = () => {
    return [
      { id: 1, name: "Participant 1", audio: true, video: true, isHost: false },
      { id: 2, name: "Participant 2", audio: false, video: true, isHost: false },
      { id: 3, name: "Participant 3", audio: true, video: false, isHost: false },
    ];
  };

  const mockParticipants = generateMockParticipants();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading meeting...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* Meeting header */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{meeting?.title || "Meeting"}</h1>
          <Badge variant="outline" className="ml-2">
            {participants.length} participants
          </Badge>
        </div>
        <div className="flex gap-2">
          <Input
            className="max-w-xs bg-gray-800 text-white placeholder:text-gray-400"
            placeholder="Invite people"
          />
          <Button variant="outline" size="sm">
            Invite
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video grid */}
        <div className="flex-1 bg-gray-900 p-4">
          <div className={`grid ${participants.length <= 1 ? 'grid-cols-1' : participants.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'} gap-4 h-full`}>
            {/* Self view */}
            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {videoEnabled ? (
                  <div className="h-full w-full bg-gradient-to-br from-blue-900 to-black"></div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-800">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-700 text-3xl font-bold">
                      {meeting?.createdBy?.charAt(0) || "Y"}
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <Badge className="bg-blue-600">You</Badge>
                {!audioEnabled && <MicOff className="h-4 w-4 text-red-500" />}
              </div>
            </div>

            {/* Participant views */}
            {mockParticipants.map((participant) => (
              <div
                key={participant.id}
                className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {participant.video ? (
                    <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-700 text-3xl font-bold">
                        {participant.name.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <span className="text-sm text-white">{participant.name}</span>
                  {!participant.audio && <MicOff className="h-4 w-4 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel: Chat or Participants */}
        {(chatOpen || participantsOpen) && (
          <div className="w-80 border-l border-gray-800 bg-gray-900">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">
                  {chatOpen ? "Chat" : "Participants"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setChatOpen(false);
                    setParticipantsOpen(false);
                  }}
                >
                  <PanelRightClose className="h-5 w-5" />
                </Button>
              </div>
              <Separator className="my-2" />

              {chatOpen && (
                <div className="h-[calc(100vh-200px)] overflow-y-auto">
                  <ChatPanel />
                </div>
              )}

              {participantsOpen && (
                <div className="h-[calc(100vh-200px)] overflow-y-auto space-y-2">
                  {/* Host */}
                  <div className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700">
                        {meeting?.createdBy?.charAt(0) || "Y"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">You (Host)</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Mic className="h-4 w-4" />
                      <Video className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Other participants */}
                  {mockParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700">
                          {participant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{participant.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {participant.audio ? (
                          <Mic className="h-4 w-4" />
                        ) : (
                          <MicOff className="h-4 w-4 text-red-500" />
                        )}
                        {participant.video ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <VideoOff className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Meeting controls */}
      <div className="border-t border-gray-800 bg-gray-900 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xs text-gray-400">
              {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={audioEnabled ? "" : "bg-red-600 text-white"}
                    onClick={toggleAudio}
                  >
                    {audioEnabled ? <Mic /> : <MicOff />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{audioEnabled ? "Turn off microphone" : "Turn on microphone"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={videoEnabled ? "" : "bg-red-600 text-white"}
                    onClick={toggleVideo}
                  >
                    {videoEnabled ? <Video /> : <VideoOff />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{videoEnabled ? "Turn off camera" : "Turn on camera"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={screenShareEnabled ? "bg-green-600 text-white" : ""}
                    onClick={toggleScreenShare}
                  >
                    <ScreenShare />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{screenShareEnabled ? "Stop screen sharing" : "Share screen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={handRaised ? "bg-yellow-600 text-white" : ""}
                    onClick={toggleRaiseHand}
                  >
                    <HandMetal />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{handRaised ? "Lower hand" : "Raise hand"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="icon" onClick={endCall}>
                    <PhoneOff />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>End meeting</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className={participantsOpen ? "text-blue-500" : ""}
              onClick={() => {
                setParticipantsOpen(!participantsOpen);
                setChatOpen(false);
              }}
            >
              <Users />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={chatOpen ? "text-blue-500" : ""}
              onClick={() => {
                setChatOpen(!chatOpen);
                setParticipantsOpen(false);
              }}
            >
              <MessageSquare />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
