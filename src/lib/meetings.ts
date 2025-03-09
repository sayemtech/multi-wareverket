
// Types for meetings functionality
export interface Meeting {
  id: string;
  title: string;
  scheduledFor: string;
  createdBy: string;
  participants: string[];
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  joinUrl: string;
  createdAt: string;
  chatRoomId?: string; // Associated chat room ID for meeting discussions
  description?: string; // Meeting description
  duration?: number; // Duration in minutes
  recordingEnabled?: boolean; // Whether recording is enabled
  isRecurring?: boolean; // Whether this is a recurring meeting
  recurringPattern?: string; // Pattern for recurring meetings (if applicable)
  password?: string; // Optional meeting password
  hostControls?: {
    muteAllParticipants?: boolean;
    disableParticipantVideo?: boolean;
    allowScreenSharing?: boolean;
    allowChat?: boolean;
    waitingRoom?: boolean;
  };
}

import { getLocalStorageData, setLocalStorageData } from "./localStorage";

const MEETINGS_STORAGE_KEY = "meetings";

// Get all meetings
export const getMeetings = (): Meeting[] => {
  return getLocalStorageData(MEETINGS_STORAGE_KEY, []);
};

// Get a single meeting by ID
export const getMeetingById = (id: string): Meeting | undefined => {
  const meetings = getMeetings();
  return meetings.find(meeting => meeting.id === id);
};

// Create a new meeting
export const createMeeting = (meetingData: Omit<Meeting, "id" | "createdAt" | "status" | "joinUrl" | "chatRoomId">): Meeting => {
  const meetings = getMeetings();
  
  // Generate a random meeting ID
  const id = Math.random().toString(36).substring(2, 15);
  
  // Create join URL (in a real app, this would come from the video service API)
  const joinUrl = `https://meeting.example.com/${id}`;
  
  const newMeeting: Meeting = {
    ...meetingData,
    id,
    status: 'scheduled',
    joinUrl,
    createdAt: new Date().toISOString(),
    chatRoomId: `meeting-${id}`, // Create an associated chat room ID for this meeting
    hostControls: {
      muteAllParticipants: false,
      disableParticipantVideo: false,
      allowScreenSharing: true,
      allowChat: true,
      waitingRoom: false
    }
  };
  
  // Save to storage
  setLocalStorageData(MEETINGS_STORAGE_KEY, [...meetings, newMeeting]);
  
  return newMeeting;
};

// Update a meeting's status
export const updateMeetingStatus = (id: string, status: Meeting['status']): Meeting | undefined => {
  const meetings = getMeetings();
  const meetingIndex = meetings.findIndex(m => m.id === id);
  
  if (meetingIndex === -1) return undefined;
  
  const updatedMeeting = {
    ...meetings[meetingIndex],
    status
  };
  
  meetings[meetingIndex] = updatedMeeting;
  setLocalStorageData(MEETINGS_STORAGE_KEY, meetings);
  
  return updatedMeeting;
};

// Update meeting settings
export const updateMeetingSettings = (
  id: string, 
  settings: Partial<Meeting>
): Meeting | undefined => {
  const meetings = getMeetings();
  const meetingIndex = meetings.findIndex(m => m.id === id);
  
  if (meetingIndex === -1) return undefined;
  
  const updatedMeeting = {
    ...meetings[meetingIndex],
    ...settings
  };
  
  meetings[meetingIndex] = updatedMeeting;
  setLocalStorageData(MEETINGS_STORAGE_KEY, meetings);
  
  return updatedMeeting;
};

// Update host controls
export const updateHostControls = (
  id: string, 
  controls: Partial<Meeting['hostControls']>
): Meeting | undefined => {
  const meetings = getMeetings();
  const meetingIndex = meetings.findIndex(m => m.id === id);
  
  if (meetingIndex === -1) return undefined;
  
  const updatedMeeting = {
    ...meetings[meetingIndex],
    hostControls: {
      ...meetings[meetingIndex].hostControls,
      ...controls
    }
  };
  
  meetings[meetingIndex] = updatedMeeting;
  setLocalStorageData(MEETINGS_STORAGE_KEY, meetings);
  
  return updatedMeeting;
};

// Join a meeting (in a real implementation, this would connect to a video service)
export const joinMeeting = (id: string): boolean => {
  const meeting = getMeetingById(id);
  
  if (!meeting) return false;
  
  // In a real implementation, this would use the video service SDK
  // For demo purposes, just open the join URL in a new tab
  window.open(meeting.joinUrl, '_blank');
  
  // Update status to active if it was scheduled
  if (meeting.status === 'scheduled') {
    updateMeetingStatus(id, 'active');
  }
  
  return true;
};

// Cancel a meeting
export const cancelMeeting = (id: string): boolean => {
  return !!updateMeetingStatus(id, 'cancelled');
};

// End an active meeting
export const endMeeting = (id: string): boolean => {
  return !!updateMeetingStatus(id, 'completed');
};

// Add participants to a meeting
export const addParticipants = (meetingId: string, newParticipants: string[]): Meeting | undefined => {
  const meetings = getMeetings();
  const meetingIndex = meetings.findIndex(m => m.id === meetingId);
  
  if (meetingIndex === -1) return undefined;
  
  // Filter out duplicates
  const uniqueNewParticipants = newParticipants.filter(
    p => !meetings[meetingIndex].participants.includes(p)
  );
  
  const updatedMeeting = {
    ...meetings[meetingIndex],
    participants: [...meetings[meetingIndex].participants, ...uniqueNewParticipants]
  };
  
  meetings[meetingIndex] = updatedMeeting;
  setLocalStorageData(MEETINGS_STORAGE_KEY, meetings);
  
  return updatedMeeting;
};

// Remove a participant from a meeting
export const removeParticipant = (meetingId: string, participantEmail: string): Meeting | undefined => {
  const meetings = getMeetings();
  const meetingIndex = meetings.findIndex(m => m.id === meetingId);
  
  if (meetingIndex === -1) return undefined;
  
  const updatedMeeting = {
    ...meetings[meetingIndex],
    participants: meetings[meetingIndex].participants.filter(p => p !== participantEmail)
  };
  
  meetings[meetingIndex] = updatedMeeting;
  setLocalStorageData(MEETINGS_STORAGE_KEY, meetings);
  
  return updatedMeeting;
};

// Get meetings for a specific participant
export const getMeetingsForParticipant = (participantEmail: string): Meeting[] => {
  const meetings = getMeetings();
  return meetings.filter(meeting => 
    meeting.participants.includes(participantEmail) || 
    meeting.createdBy === participantEmail
  );
};

// Send meeting invitations (in a real app, this would send emails)
export const sendMeetingInvitations = (meetingId: string): boolean => {
  const meeting = getMeetingById(meetingId);
  
  if (!meeting) return false;
  
  // In a real implementation, this would send emails to participants
  console.log(`Sending invitations for meeting "${meeting.title}" to:`, meeting.participants);
  
  return true;
};

// Generate meeting report
export const generateMeetingReport = (id: string): any => {
  const meeting = getMeetingById(id);
  
  if (!meeting) return null;
  
  // In a real app, this would generate a comprehensive report with analytics
  return {
    meetingId: meeting.id,
    title: meeting.title,
    date: meeting.scheduledFor,
    duration: meeting.duration || 60,
    hostEmail: meeting.createdBy,
    totalParticipants: meeting.participants.length,
    status: meeting.status
  };
};

// Create recurring meeting series
export const createRecurringMeeting = (
  baseData: Omit<Meeting, "id" | "createdAt" | "status" | "joinUrl" | "chatRoomId">,
  pattern: string,
  occurrences: number
): Meeting[] => {
  const createdMeetings: Meeting[] = [];
  
  // Create the first meeting
  const firstMeeting = createMeeting({
    ...baseData,
    isRecurring: true,
    recurringPattern: pattern
  });
  
  createdMeetings.push(firstMeeting);
  
  // In a real implementation, we would create the series based on the pattern
  // For this demo, we'll just create dummy future meetings
  
  const baseDate = new Date(baseData.scheduledFor);
  
  for (let i = 1; i < occurrences; i++) {
    // Simple weekly pattern for demo purposes
    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + (7 * i)); // Add weeks
    
    const nextMeeting = createMeeting({
      ...baseData,
      scheduledFor: nextDate.toISOString(),
      isRecurring: true,
      recurringPattern: pattern
    });
    
    createdMeetings.push(nextMeeting);
  }
  
  return createdMeetings;
};
