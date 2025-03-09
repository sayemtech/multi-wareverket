
import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Copy, 
  Edit, 
  Link, 
  MoreVertical, 
  Plus, 
  RefreshCw, 
  Trash2, 
  UserPlus, 
  Users, 
  Video, 
  VideoOff 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { 
  getMeetings, 
  createMeeting, 
  cancelMeeting, 
  joinMeeting,
  createRecurringMeeting,
  Meeting 
} from "@/lib/meetings";

const meetingFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  scheduledFor: z.string().min(1, { message: "Please select a date and time." }),
  participants: z.string(),
  description: z.string().optional(),
  duration: z.string().min(1, { message: "Please select a duration." }),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),
  recordingEnabled: z.boolean().default(false),
  waitingRoom: z.boolean().default(false),
  password: z.string().optional(),
});

export function MeetingsTabContent() {
  const [meetings, setMeetings] = useState<Meeting[]>(getMeetings());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  
  const form = useForm<z.infer<typeof meetingFormSchema>>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: "",
      scheduledFor: "",
      participants: "",
      description: "",
      duration: "60",
      isRecurring: false,
      recurringPattern: "weekly",
      recordingEnabled: false,
      waitingRoom: false,
      password: "",
    },
  });

  // Refresh meetings list
  useEffect(() => {
    setMeetings(getMeetings());
  }, []);

  // Format date for displaying
  const formatMeetingDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  // Handle copy link button click
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => toast.success("Meeting link copied to clipboard"),
      () => toast.error("Failed to copy meeting link")
    );
  };

  // Handle join meeting button click
  const handleJoinMeeting = (id: string) => {
    if (joinMeeting(id)) {
      toast.success("Joining meeting...");
      setMeetings(getMeetings()); // Refresh list
    } else {
      toast.error("Failed to join meeting");
    }
  };

  // Handle cancel meeting
  const handleCancelMeeting = (id: string) => {
    if (cancelMeeting(id)) {
      toast.success("Meeting cancelled");
      setMeetings(getMeetings()); // Refresh list
    } else {
      toast.error("Failed to cancel meeting");
    }
  };

  // Get status badge based on meeting status
  const getStatusBadge = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-600">Scheduled</Badge>;
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'completed':
        return <Badge className="bg-gray-600">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600">Cancelled</Badge>;
      default:
        return null;
    }
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof meetingFormSchema>) => {
    try {
      // Parse participants
      const participants = data.participants
        .split(",")
        .map(email => email.trim())
        .filter(email => email);
      
      // If recurring, create recurring meeting series
      if (data.isRecurring && data.recurringPattern) {
        createRecurringMeeting(
          {
            title: data.title,
            scheduledFor: data.scheduledFor,
            createdBy: "Admin User",
            participants,
            description: data.description,
            duration: parseInt(data.duration),
            recordingEnabled: data.recordingEnabled,
            isRecurring: true,
            recurringPattern: data.recurringPattern,
            password: isPasswordProtected ? data.password : undefined,
            hostControls: {
              waitingRoom: data.waitingRoom
            }
          },
          data.recurringPattern,
          4 // Create 4 occurrences for demo
        );
        
        toast.success("Recurring meetings scheduled successfully");
      } else {
        // Create single meeting
        createMeeting({
          title: data.title,
          scheduledFor: data.scheduledFor,
          createdBy: "Admin User",
          participants,
          description: data.description,
          duration: parseInt(data.duration),
          recordingEnabled: data.recordingEnabled,
          password: isPasswordProtected ? data.password : undefined,
          hostControls: {
            waitingRoom: data.waitingRoom
          }
        });
        
        toast.success("Meeting scheduled successfully");
      }
      
      // Reset form and close dialog
      form.reset();
      setIsCreateDialogOpen(false);
      setIsRecurring(false);
      setIsPasswordProtected(false);
      
      // Refresh meeting list
      setMeetings(getMeetings());
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meetings</h2>
          <p className="text-muted-foreground">
            Schedule and manage your video meetings
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upcoming meetings section */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
            <Button variant="ghost" size="sm" onClick={() => setMeetings(getMeetings())}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {meetings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No meetings scheduled</p>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  You don't have any upcoming meetings. Create a new meeting to get started.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Meeting
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {meetings
                .filter(meeting => meeting.status !== 'cancelled' && meeting.status !== 'completed')
                .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
                .map((meeting) => (
                  <Card key={meeting.id} className="overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-950/30 p-1">
                      <CardHeader className="p-4 pb-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-xl">{meeting.title}</CardTitle>
                              {getStatusBadge(meeting.status)}
                              {meeting.isRecurring && (
                                <Badge variant="outline" className="gap-1 border-blue-200 text-blue-600">
                                  <RefreshCw className="h-3 w-3" />
                                  Recurring
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="mt-2 space-y-1">
                              <div className="flex items-center text-sm">
                                <Calendar className="mr-2 h-4 w-4" />
                                {formatMeetingDate(meeting.scheduledFor)}
                                {meeting.duration && (
                                  <span className="ml-2 flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {meeting.duration} min
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center text-sm">
                                <Users className="mr-2 h-4 w-4" />
                                {meeting.participants.length + 1} participants
                              </div>
                              {meeting.description && (
                                <p className="text-sm mt-2">{meeting.description}</p>
                              )}
                            </CardDescription>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Meeting options</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Link className="h-4 w-4" />
                          <span className="flex-1 truncate">{meeting.joinUrl}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1"
                            onClick={() => handleCopyLink(meeting.joinUrl)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                    <CardFooter className="flex justify-between bg-card p-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-blue-600"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-blue-600"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Invite
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {meeting.status !== 'active' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelMeeting(meeting.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleJoinMeeting(meeting.id)}
                        >
                          {meeting.status === 'active' ? 'Join Now' : 'Start'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}

          {/* Past meetings section */}
          {meetings.filter(m => m.status === 'completed' || m.status === 'cancelled').length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Past Meetings</h3>
              <div className="space-y-3">
                {meetings
                  .filter(meeting => meeting.status === 'completed' || meeting.status === 'cancelled')
                  .slice(0, 3) // Show only recent 3 past meetings
                  .map((meeting) => (
                    <Card key={meeting.id} className="opacity-75">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle>{meeting.title}</CardTitle>
                              {getStatusBadge(meeting.status)}
                            </div>
                            <CardDescription className="mt-1">
                              {formatMeetingDate(meeting.scheduledFor)}
                            </CardDescription>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-end p-3">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick actions section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Start an instant meeting</CardTitle>
              <CardDescription>
                Create a meeting and start it immediately
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <Input placeholder="Meeting name (optional)" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Video className="mr-2 h-4 w-4" />
                Start Now
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Join with a code</CardTitle>
              <CardDescription>
                Enter a meeting code or link to join
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <Input placeholder="Enter meeting code or URL" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Join Meeting
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Your Personal Meeting ID</h4>
              <div className="flex items-center gap-2 mb-3">
                <code className="rounded bg-muted px-2 py-1 text-sm">
                  123-456-789
                </code>
                <Button variant="ghost" size="sm" className="h-7 gap-1 px-2">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Start Meeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create meeting dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule a New Meeting</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new video meeting
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Quarterly Team Review" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduledFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date and Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email1@example.com, email2@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter comma-separated email addresses
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Meeting agenda and details" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="recurring" 
                      checked={isRecurring}
                      onCheckedChange={(checked) => {
                        setIsRecurring(checked);
                        form.setValue("isRecurring", checked);
                      }}
                    />
                    <label htmlFor="recurring" className="text-sm font-medium">
                      Recurring meeting
                    </label>
                  </div>
                  
                  {isRecurring && (
                    <FormField
                      control={form.control}
                      name="recurringPattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="recordingEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Switch 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium">
                          Record meeting automatically
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="waitingRoom"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Switch 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium">
                          Enable waiting room
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="password-protected" 
                      checked={isPasswordProtected}
                      onCheckedChange={setIsPasswordProtected}
                    />
                    <label htmlFor="password-protected" className="text-sm font-medium">
                      Password protect
                    </label>
                  </div>
                  
                  {isPasswordProtected && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="password" placeholder="Meeting password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Meeting</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
