
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
export const createMeeting = (meetingData: Omit<Meeting, "id" | "createdAt" | "status" | "joinUrl">): Meeting => {
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
