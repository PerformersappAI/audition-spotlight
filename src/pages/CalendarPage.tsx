import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Film, Trophy, Plus, Download, Mail, Send, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { exportCalendarToPDF } from "@/utils/exportCalendarToPDF";
import { supabase } from "@/integrations/supabase/client";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "audition" | "festival" | "deadline" | "meeting";
  location?: string;
  description?: string;
  status?: string;
}

const CalendarPage = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Share form state
  const [shareEmails, setShareEmails] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  
  // Mock events - in real app, these would come from the database
  const [events] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Indie Drama Auditions",
      date: new Date(2024, 11, 15),
      type: "audition",
      location: "Los Angeles, CA",
      description: "Callback auditions for lead role",
      status: "confirmed"
    },
    {
      id: "2",
      title: "Short Film Festival Deadline",
      date: new Date(2024, 11, 20),
      type: "deadline",
      description: "Final submission deadline for Sundance shorts"
    },
    {
      id: "3",
      title: "Cannes Film Festival",
      date: new Date(2024, 11, 25),
      type: "festival",
      location: "Cannes, France",
      description: "Festival screening dates"
    },
    {
      id: "4",
      title: "Producer Meeting",
      date: new Date(2024, 11, 28),
      type: "meeting",
      location: "Studio City, CA",
      description: "Discuss new project opportunities"
    }
  ]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "audition": return <Users className="h-4 w-4" />;
      case "festival": return <Trophy className="h-4 w-4" />;
      case "deadline": return <Clock className="h-4 w-4" />;
      case "meeting": return <Film className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "audition": return "bg-blue-500";
      case "festival": return "bg-purple-500";
      case "deadline": return "bg-red-500";
      case "meeting": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const fileName = exportCalendarToPDF(events, selectedDate);
      toast({
        title: "PDF Exported",
        description: `Calendar saved as ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export calendar to PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareCalendar = async () => {
    const emailList = shareEmails
      .split(/[,\n]/)
      .map(e => e.trim())
      .filter(e => e.length > 0);

    if (emailList.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please enter at least one email address",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(e => !emailRegex.test(e));
    if (invalidEmails.length > 0) {
      toast({
        title: "Invalid Email",
        description: `Invalid email format: ${invalidEmails.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const eventsForEmail = events.map(e => ({
        ...e,
        date: e.date.toISOString(),
      }));

      const { data, error } = await supabase.functions.invoke('send-calendar', {
        body: {
          recipients: emailList,
          events: eventsForEmail,
          message: shareMessage || undefined,
          senderName: userProfile?.first_name 
            ? `${userProfile.first_name} ${userProfile.last_name || ''}`.trim()
            : undefined,
          upcomingOnly,
        },
      });

      if (error) throw error;

      toast({
        title: "Calendar Shared",
        description: data.message || `Calendar sent to ${emailList.length} recipient(s)`,
      });

      // Reset form
      setShareEmails("");
      setShareMessage("");
      setUpcomingOnly(false);
      setIsShareOpen(false);
    } catch (error: any) {
      console.error("Error sharing calendar:", error);
      toast({
        title: "Share Failed",
        description: error.message || "Failed to share calendar",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const upcomingEvents = getUpcomingEvents();

  const eventDates = events.map(event => event.date);

  return (
    <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              Calendar
            </h1>
            <p className="text-muted-foreground">Track your auditions, deadlines, and industry events</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new calendar event for auditions, festivals, deadlines, or meetings.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" placeholder="Enter event title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select>
                      <SelectTrigger id="event-type">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="audition">Audition</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input id="event-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-location">Location (optional)</Label>
                    <Input id="event-location" placeholder="Enter location" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description (optional)</Label>
                    <Textarea id="event-description" placeholder="Enter event description" />
                  </div>
                  <Button className="w-full">Create Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {events.filter(e => e.type === 'audition').length}
              </div>
              <p className="text-sm text-muted-foreground">Auditions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.type === 'festival').length}
              </div>
              <p className="text-sm text-muted-foreground">Festivals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {events.filter(e => e.type === 'deadline').length}
              </div>
              <p className="text-sm text-muted-foreground">Deadlines</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.type === 'meeting').length}
              </div>
              <p className="text-sm text-muted-foreground">Meetings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: eventDates
                  }}
                  modifiersStyles={{
                    hasEvent: { 
                      backgroundColor: "hsl(var(--primary))", 
                      color: "hsl(var(--primary-foreground))",
                      fontWeight: "bold"
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Selected Date Events */}
            {selectedDate && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Events for {selectedDate.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No events scheduled for this date
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateEvents.map(event => (
                        <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{event.title}</h3>
                            {event.description && (
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">{event.location}</span>
                              </div>
                            )}
                            <Badge variant="outline" className="mt-2 text-xs">
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Share Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isShareOpen ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsShareOpen(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Share with Team
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Send to:</Label>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsShareOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Enter email addresses (comma or newline separated)"
                      value={shareEmails}
                      onChange={(e) => setShareEmails(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="space-y-2">
                      <Label className="text-sm">Message (optional)</Label>
                      <Textarea
                        placeholder="Add a personal message..."
                        value={shareMessage}
                        onChange={(e) => setShareMessage(e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="upcoming-only" className="text-sm">
                        Upcoming events only
                      </Label>
                      <Switch
                        id="upcoming-only"
                        checked={upcomingOnly}
                        onCheckedChange={setUpcomingOnly}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleShareCalendar}
                      disabled={isSending}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? "Sending..." : "Send Calendar"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No upcoming events
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map(event => (
                      <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg border-l-4 border-l-primary bg-muted/30">
                        <div className={`p-1 rounded-full ${getEventColor(event.type)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {event.date.toLocaleDateString()}
                          </p>
                          {event.location && (
                            <p className="text-xs text-muted-foreground">{event.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Schedule Audition
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="h-4 w-4 mr-2" />
                  Add Festival
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Set Deadline
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Film className="h-4 w-4 mr-2" />
                  Book Meeting
                </Button>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Auditions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Festivals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Deadlines</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Meetings</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default CalendarPage;
