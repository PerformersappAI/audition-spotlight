import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  location?: string;
  description?: string;
  status?: string;
}

interface SendCalendarRequest {
  recipients: string[];
  events: CalendarEvent[];
  message?: string;
  senderName?: string;
  upcomingOnly?: boolean;
}

const getEventTypeColor = (type: string): string => {
  switch (type) {
    case "audition": return "#3B82F6";
    case "festival": return "#A855F7";
    case "deadline": return "#EF4444";
    case "meeting": return "#22C55E";
    default: return "#6B7280";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const generateEmailHTML = (events: CalendarEvent[], message?: string, senderName?: string): string => {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const eventRows = sortedEvents.map(event => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${formatDate(event.date)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <span style="color: ${getEventTypeColor(event.type)}; font-weight: 600; text-transform: capitalize;">
          ${event.type}
        </span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 500;">
        ${event.title}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
        ${event.location || '-'}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background-color: #1e293b; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Production Calendar</h1>
          <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">
            ${senderName ? `Shared by ${senderName}` : 'Shared Calendar'}
          </p>
        </div>
        
        <!-- Content -->
        <div style="background-color: #ffffff; padding: 24px; border-radius: 0 0 8px 8px;">
          ${message ? `
            <div style="background-color: #f0f9ff; padding: 16px; border-radius: 6px; margin-bottom: 24px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af; font-style: italic;">"${message}"</p>
            </div>
          ` : ''}
          
          <!-- Stats -->
          <div style="display: flex; gap: 12px; margin-bottom: 24px;">
            <div style="flex: 1; text-align: center; padding: 12px; background-color: #3b82f6; border-radius: 6px;">
              <div style="color: #ffffff; font-size: 20px; font-weight: bold;">
                ${events.filter(e => e.type === 'audition').length}
              </div>
              <div style="color: #bfdbfe; font-size: 12px;">Auditions</div>
            </div>
            <div style="flex: 1; text-align: center; padding: 12px; background-color: #a855f7; border-radius: 6px;">
              <div style="color: #ffffff; font-size: 20px; font-weight: bold;">
                ${events.filter(e => e.type === 'festival').length}
              </div>
              <div style="color: #e9d5ff; font-size: 12px;">Festivals</div>
            </div>
            <div style="flex: 1; text-align: center; padding: 12px; background-color: #ef4444; border-radius: 6px;">
              <div style="color: #ffffff; font-size: 20px; font-weight: bold;">
                ${events.filter(e => e.type === 'deadline').length}
              </div>
              <div style="color: #fecaca; font-size: 12px;">Deadlines</div>
            </div>
            <div style="flex: 1; text-align: center; padding: 12px; background-color: #22c55e; border-radius: 6px;">
              <div style="color: #ffffff; font-size: 20px; font-weight: bold;">
                ${events.filter(e => e.type === 'meeting').length}
              </div>
              <div style="color: #bbf7d0; font-size: 12px;">Meetings</div>
            </div>
          </div>
          
          <!-- Events Table -->
          <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 16px;">Events</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #64748b;">Date</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #64748b;">Type</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #64748b;">Event</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #64748b;">Location</th>
              </tr>
            </thead>
            <tbody>
              ${eventRows}
            </tbody>
          </table>
          
          ${events.length === 0 ? `
            <p style="text-align: center; color: #6b7280; padding: 24px;">No events to display.</p>
          ` : ''}
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 16px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">Sent via Filmmaker AI Production Calendar</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients, events, message, senderName, upcomingOnly }: SendCalendarRequest = await req.json();

    console.log(`Sending calendar to ${recipients.length} recipients`);
    console.log(`Events count: ${events.length}, Upcoming only: ${upcomingOnly}`);

    // Validate recipients
    if (!recipients || recipients.length === 0) {
      throw new Error("At least one recipient email is required");
    }

    // Filter to upcoming events if requested
    let eventsToSend = events;
    if (upcomingOnly) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventsToSend = events.filter(e => new Date(e.date) >= today);
    }

    const html = generateEmailHTML(eventsToSend, message, senderName);

    // Send emails to all recipients
    const emailPromises = recipients.map(email => 
      resend.emails.send({
        from: "Filmmaker AI <onboarding@resend.dev>",
        to: [email.trim()],
        subject: `Production Calendar${senderName ? ` - Shared by ${senderName}` : ''}`,
        html,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Emails sent: ${successful} successful, ${failed} failed`);

    if (failed > 0) {
      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map(r => r.reason?.message || 'Unknown error');
      console.error("Some emails failed:", errors);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful, 
        failed,
        message: `Calendar sent to ${successful} recipient(s)` 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-calendar function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
