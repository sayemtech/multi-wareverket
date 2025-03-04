
import React, { useState, useRef } from "react";
import { Camera, QrCode, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BarcodeScannerProps {
  onCodeScanned: (code: string) => void;
  className?: string;
}

export function BarcodeScanner({
  onCodeScanned,
  className,
}: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onCodeScanned(manualCode.trim());
      setManualCode("");
      setIsOpen(false);
    }
  };
  
  const simulateScan = () => {
    setScanning(true);
    
    // Simulate a scan after a delay
    setTimeout(() => {
      const fakeBarcode = "ITM" + Math.floor(Math.random() * 10000000).toString().padStart(7, "0");
      onCodeScanned(fakeBarcode);
      setScanning(false);
      setIsOpen(false);
    }, 2000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <QrCode className="mr-2 h-4 w-4" />
          Scan Barcode
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Item Barcode</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {scanning ? (
            <div className="p-6 bg-muted rounded-lg flex flex-col items-center justify-center">
              <RefreshCw className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-center">Scanning...</p>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardHeader className="p-4 pb-2 flex justify-between flex-row items-center">
                <h3 className="text-sm font-medium">Camera Viewfinder</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <div className="bg-muted aspect-video rounded flex items-center justify-center">
                  <Camera className="h-10 w-10 text-muted-foreground opacity-40" />
                </div>
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  Position the barcode within the viewfinder to scan
                </p>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={simulateScan}>
                  Start Scanning
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or enter manually
              </span>
            </div>
          </div>
          
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <Input
              placeholder="Enter barcode number..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
