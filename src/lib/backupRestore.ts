
import { getLocalStorageData, setLocalStorageData } from "./localStorage";
import { toast } from "sonner";

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    [key: string]: any;
  };
}

const LOCAL_STORAGE_KEYS = [
  "audits",
  "inventory",
  "locations",
  "products",
  "transfers",
  "vendors",
  "userSettings"
];

// Create a backup of all data
export const createBackup = (): BackupData => {
  const backup: BackupData = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    data: {}
  };

  LOCAL_STORAGE_KEYS.forEach(key => {
    try {
      const data = getLocalStorageData(key, null);
      if (data) {
        backup.data[key] = data;
      }
    } catch (error) {
      console.error(`Error backing up ${key}:`, error);
    }
  });

  return backup;
};

// Download backup as JSON file
export const downloadBackup = () => {
  try {
    const backup = createBackup();
    const backupString = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `invstrar-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error creating backup:", error);
    return false;
  }
};

// Restore from backup file
export const restoreFromBackup = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target?.result as string) as BackupData;
        
        // Validate backup structure
        if (!backup.version || !backup.timestamp || !backup.data) {
          toast.error("Invalid backup file format");
          resolve(false);
          return;
        }
        
        // Restore each data item
        Object.entries(backup.data).forEach(([key, value]) => {
          if (LOCAL_STORAGE_KEYS.includes(key)) {
            setLocalStorageData(key, value);
          }
        });
        
        resolve(true);
      } catch (error) {
        console.error("Error restoring from backup:", error);
        resolve(false);
      }
    };
    
    reader.onerror = () => {
      resolve(false);
    };
    
    reader.readAsText(file);
  });
};
