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
  PlusCircle,
  AlertCircle,
  Share2,
  CircleDot,
  Layout,
  SlidersHorizontal,
  Lock,
  Copy,
} from "lucide-react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { 
  getMeetingById, 
  updateMeetingStatus, 
  updateHostControls, 
  addParticipants,
  Meeting
} from "@/lib/meetings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

export default function MeetingRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [newParticipantEmail, setNewParticipantEmail] = useState("");
  const [meetingTime, setMeetingTime] = useState(0);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'speaker'>('grid');
  const [meetingSecurityOpen, setMeetingSecurityOpen] = useState(false);
  const [newMeetingPassword, setNewMeetingPassword] = useState("");

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
    
    if (meetingData.recordingEnabled) {
      setIsRecording(true);
      toast.success("Recording started automatically");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (meeting?.status === 'active') {
      const timer = setInterval(() => {
        setMeetingTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [meeting?.status]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast.info(`Microphone ${audioEnabled ? "muted" : "unmuted"}`);
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    toast.info(`Camera ${videoEnabled ? "turned off" : "turned on"}`);
  };

  const toggleScreenShare = () => {
    if (screenShareEnabled) {
      setScreenShareEnabled(false);
      toast.info("Screen sharing stopped");
    } else {
      setScreenShareEnabled(true);
      toast.info("Screen sharing started");
    }
  };

  const toggleRaiseHand = () => {
    setHandRaised(!handRaised);
    toast.info(`Hand ${handRaised ? "lowered" : "raised"}`);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast.info(`Recording ${isRecording ? "stopped" : "started"}`);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const toggleMuteAll = () => {
    if (!id || !meeting) return;
    
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    updateHostControls(id, {
      muteAllParticipants: newMuteState
    });
    
    toast.info(`All participants ${newMuteState ? 'muted' : 'unmuted'}`);
  };

  const addParticipant = () => {
    if (!id || !newParticipantEmail.trim()) return;
    
    addParticipants(id, [newParticipantEmail.trim()]);
    toast.success(`Invitation sent to ${newParticipantEmail}`);
    
    const updatedMeeting = getMeetingById(id);
    if (updatedMeeting) {
      setMeeting(updatedMeeting);
      setParticipants([updatedMeeting.createdBy, ...updatedMeeting.participants.slice(0, 5)]);
    }
    
    setNewParticipantEmail("");
    setIsAddParticipantOpen(false);
  };

  const updatePassword = () => {
    if (!id || !meeting) return;
    
    const updatedMeeting = updateMeetingStatus(id, meeting.status);
    
    if (updatedMeeting) {
      setMeeting(updatedMeeting);
      toast.success("Meeting security settings updated");
    } else {
      toast.error("Failed to update meeting security");
    }
    
    setMeetingSecurityOpen(false);
  };

  const copyMeetingLink = () => {
    if (!meeting) return;
    
    navigator.clipboard.writeText(meeting.joinUrl).then(
      () => toast.success("Meeting link copied to clipboard"),
      () => toast.error("Failed to copy meeting link")
    );
  };

  const endCall = () => {
    if (id) {
      updateMeetingStatus(id, 'completed');
      toast.success("Meeting ended");
      navigate("/settings");
    }
  };

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
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{meeting?.title || "Meeting"}</h1>
          <Badge variant="outline" className="ml-2">
            {participants.length} participants
          </Badge>
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              <CircleDot className="mr-1 h-3 w-3" /> Recording
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">
            {formatTime(meetingTime)}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setIsAddParticipantOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Invite
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 text-white border-gray-700">
                <DropdownMenuItem onClick={copyMeetingLink} className="cursor-pointer">
                  <Copy className="mr-2 h-4 w-4" /> Copy meeting link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleFullScreen} className="cursor-pointer">
                  <Share2 className="mr-2 h-4 w-4" /> {isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={() => setMeetingSecurityOpen(true)} className="cursor-pointer">
                  <Lock className="mr-2 h-4 w-4" /> Meeting security
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="cursor-pointer">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-900 p-4">
          <div className={`${layoutMode === 'grid' ? `grid ${participants.length <= 1 ? 'grid-cols-1' : participants.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'} gap-4 h-full` : 'flex flex-col h-full'}`}>
            <div className={`relative ${layoutMode === 'speaker' ? 'flex-1' : ''} aspect-video bg-gray-800 rounded-lg overflow-hidden`}>
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
                <Badge className="bg-blue-600">You (Host)</Badge>
                {!audioEnabled && <MicOff className="h-4 w-4 text-red-500" />}
              </div>
            </div>

            {layoutMode === 'grid' ? (
              mockParticipants.map((participant) => (
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
              ))
            ) : (
              <div className="h-24 flex gap-2 mt-2">
                {mockParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden h-full"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {participant.video ? (
                        <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-800">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-xl font-bold">
                            {participant.name.charAt(0)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-1 left-1 flex items-center gap-1">
                      <span className="text-xs text-white">{participant.name}</span>
                      {!participant.audio && <MicOff className="h-3 w-3 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
                <div className="bg-blue-900/30 rounded-md p-3 mb-4">
                  <h3 className="text-sm font-medium mb-2">Host Controls</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant={isMuted ? "destructive" : "outline"} 
                      size="sm"
                      onClick={toggleMuteAll}
                    >
                      {isMuted ? (
                        <>
                          <MicOff className="mr-1 h-3 w-3" /> Unmute All
                        </>
                      ) : (
                        <>
                          <Mic className="mr-1 h-3 w-3" /> Mute All
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsAddParticipantOpen(true)}
                    >
                      <PlusCircle className="mr-1 h-3 w-3" /> Add
                    </Button>
                  </div>
                </div>
                
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
      </div>

      <div className="border-t border-gray-800 bg-gray-900 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xs text-gray-400">
              {formatTime(meetingTime)}
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
                    className={isRecording ? "bg-red-600 text-white animate-pulse" : ""}
                    onClick={toggleRecording}
                  >
                    <CircleDot />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording ? "Stop recording" : "Start recording"}</p>
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
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setLayoutMode(layoutMode === 'grid' ? 'speaker' : 'grid')}
                  >
                    <Layout />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change layout: {layoutMode === 'grid' ? 'Speaker view' : 'Grid view'}</p>
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
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isAddParticipantOpen} onOpenChange={setIsAddParticipantOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the email address of the person you want to invite to this meeting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="participant-email" className="text-sm font-medium">
                Email address
              </label>
              <Input
                id="participant-email"
                placeholder="email@example.com"
                value={newParticipantEmail}
                onChange={(e) => setNewParticipantEmail(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddParticipantOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addParticipant}>
              Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Meeting Settings</DialogTitle>
            <DialogDescription className="text-gray-400">
              Adjust your audio, video, and meeting preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Audio Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="mic-input" className="text-sm">
                    Microphone
                  </label>
                  <select
                    id="mic-input"
                    className="bg-gray-800 border-gray-700 rounded text-sm p-1"
                  >
                    <option>Default Microphone</option>
                    <option>Internal Microphone</option>
                    <option>External Microphone</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="speaker-output" className="text-sm">
                    Speaker
                  </label>
                  <select
                    id="speaker-output"
                    className="bg-gray-800 border-gray-700 rounded text-sm p-1"
                  >
                    <option>Default Speaker</option>
                    <option>Internal Speaker</option>
                    <option>External Speaker</option>
                  </select>
                </div>
              </div>
            </div>
            
            <Separator className="bg-gray-800" />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Video Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="camera-input" className="text-sm">
                    Camera
                  </label>
                  <select
                    id="camera-input"
                    className="bg-gray-800 border-gray-700 rounded text-sm p-1"
                  >
                    <option>Default Camera</option>
                    <option>Front Camera</option>
                    <option>External Webcam</option>
                  </select>
                </div>
              </div>
            </div>
            
            <Separator className="bg-gray-800" />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Virtual Background</h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="aspect-video bg-gray-800 rounded cursor-pointer hover:ring-2 hover:ring-blue-500"></div>
                <div className="aspect-video bg-gradient-to-r from-blue-900 to-black rounded cursor-pointer hover:ring-2 hover:ring-blue-500"></div>
                <div className="aspect-video bg-gradient-to-r from-green-900 to-blue-900 rounded cursor-pointer hover:ring-2 hover:ring-blue-500"></div>
                <div className="aspect-video bg-gradient-to-r from-purple-900 to-pink-900 rounded cursor-pointer hover:ring-2 hover:ring-blue-500"></div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={meetingSecurityOpen} onOpenChange={setMeetingSecurityOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Meeting Security</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update security settings for this meeting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Meeting Password
              </label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newMeetingPassword}
                onChange={(e) => setNewMeetingPassword(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-400">
                Leave blank to remove password protection.
              </p>
            </div>
            
            <Separator className="bg-gray-800" />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">
                  Waiting Room
                </label>
                <input
                  type="checkbox"
                  className="rounded border-gray-700"
                  checked={meeting?.hostControls?.waitingRoom || false}
                  onChange={() => {
                    if (id) {
                      updateHostControls(id, {
                        waitingRoom: !(meeting?.hostControls?.waitingRoom || false)
                      });
                      
                      const updatedMeeting = getMeetingById(id);
                      if (updatedMeeting) {
                        setMeeting(updatedMeeting);
                      }
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">
                Participants must be admitted by the host.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">
                  Allow Screen Sharing
                </label>
                <input
                  type="checkbox"
                  className="rounded border-gray-700"
                  checked={meeting?.hostControls?.allowScreenSharing !== false}
                  onChange={() => {
                    if (id) {
                      updateHostControls(id, {
                        allowScreenSharing: !(meeting?.hostControls?.allowScreenSharing !== false)
                      });
                      
                      const updatedMeeting = getMeetingById(id);
                      if (updatedMeeting) {
                        setMeeting(updatedMeeting);
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">
                  Allow Chat
                </label>
                <input
                  type="checkbox"
                  className="rounded border-gray-700"
                  checked={meeting?.hostControls?.allowChat !== false}
                  onChange={() => {
                    if (id) {
                      updateHostControls(id, {
                        allowChat: !(meeting?.hostControls?.allowChat !== false)
                      });
                      
                      const updatedMeeting = getMeetingById(id);
                      if (updatedMeeting) {
                        setMeeting(updatedMeeting);
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMeetingSecurityOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updatePassword}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
