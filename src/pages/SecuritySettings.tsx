
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Eye, Clock, Key } from "lucide-react";

const SecuritySettings = () => {
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [autoLockDelay, setAutoLockDelay] = useState(5);
  const [secretCode, setSecretCode] = useState("mansur");
  const [showSecretCode, setShowSecretCode] = useState(false);

  const handleSaveSettings = () => {
    // In a real implementation, these settings would be saved to a database or local storage
    toast("Security settings saved", {
      description: "Your security preferences have been updated"
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Application Security</CardTitle>
              </div>
              <CardDescription>
                Configure how your application handles security and access control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Lock Application</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically lock the application after a period of inactivity
                  </p>
                </div>
                <Switch 
                  checked={autoLockEnabled}
                  onCheckedChange={setAutoLockEnabled}
                />
              </div>
              
              {autoLockEnabled && (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="lockDelay">Lock Delay (seconds)</Label>
                  </div>
                  <Input
                    id="lockDelay"
                    type="number"
                    min={1}
                    max={300}
                    value={autoLockDelay}
                    onChange={(e) => setAutoLockDelay(parseInt(e.target.value) || 5)}
                  />
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="secretCode">Secret Unlock Code</Label>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="secretCode"
                        type={showSecretCode ? "text" : "password"}
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecretCode(!showSecretCode)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is the code you'll need to type after clicking anywhere on the screen when the app is locked
                  </p>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings} className="w-full">
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SecuritySettings;
