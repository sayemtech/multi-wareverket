
import React from 'react';

// Type for audio recorder state
type RecorderState = "inactive" | "recording" | "paused";

// Interface for the recorder object
interface AudioRecorder {
  start: () => Promise<void>;
  stop: () => Promise<string>;
  pause: () => void;
  resume: () => void;
  getState: () => RecorderState;
  getBlob: () => Blob | null;
}

// Create and return an audio recorder object
export const createAudioRecorder = (): AudioRecorder => {
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let audioBlob: Blob | null = null;
  
  // Request microphone access and create a MediaRecorder
  const start = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      
      // Clear any previous recording data
      audioChunks = [];
      audioBlob = null;
      
      // Handle data availability (collect audio chunks)
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw new Error("Could not access microphone");
    }
  };
  
  // Stop recording and return the audio URL
  const stop = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        reject(new Error("No active recording"));
        return;
      }
      
      // Define onstop handler to resolve with the audio URL
      const originalOnStop = mediaRecorder.onstop;
      mediaRecorder.onstop = (event) => {
        // Call the original onstop handler
        if (originalOnStop) {
          originalOnStop.call(mediaRecorder, event);
        }
        
        // Create a URL for the audio blob
        if (audioBlob) {
          const audioUrl = URL.createObjectURL(audioBlob);
          resolve(audioUrl);
        } else {
          reject(new Error("No audio data captured"));
        }
      };
      
      // Stop the recording
      mediaRecorder.stop();
    });
  };
  
  // Pause the recording
  const pause = (): void => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    }
  };
  
  // Resume the recording
  const resume = (): void => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    }
  };
  
  // Get the current recorder state
  const getState = (): RecorderState => {
    if (!mediaRecorder) return "inactive";
    return mediaRecorder.state as RecorderState;
  };
  
  // Get the recorded audio blob
  const getBlob = (): Blob | null => {
    return audioBlob;
  };
  
  return {
    start,
    stop,
    pause,
    resume,
    getState,
    getBlob
  };
};

// Hook for using the audio recorder
export const useAudioRecorder = () => {
  const recorderRef = React.useRef<AudioRecorder | null>(null);
  
  React.useEffect(() => {
    // Create the recorder
    recorderRef.current = createAudioRecorder();
    
    return () => {
      // Clean up if needed
      if (recorderRef.current && recorderRef.current.getState() !== "inactive") {
        recorderRef.current.stop().catch(console.error);
      }
    };
  }, []);
  
  return recorderRef.current;
};
