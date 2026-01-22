import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-welcome-email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName }: WelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to: ${email}, firstName: ${firstName}`);

    if (!email) {
      throw new Error("Email is required");
    }

    const emailResponse = await resend.emails.send({
      from: "FilmMaker Genius <noreply@filmmakergenius.com>",
      to: [email],
      subject: "Welcome to FilmMaker Genius! 🎬",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #fbbf24; font-size: 28px; margin: 0;">🎬 FilmMaker Genius</h1>
            </div>
            
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid #fbbf24;">
              <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0;">
                Welcome${firstName ? `, ${firstName}` : ''}! 🎉
              </h2>
              
              <p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for joining FilmMaker Genius! You now have access to powerful AI tools designed to help filmmakers bring their creative visions to life.
              </p>
              
              <div style="background: rgba(251, 191, 36, 0.1); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #fbbf24;">
                <h3 style="color: #fbbf24; font-size: 18px; margin: 0 0 10px 0;">🎁 Your 7-Day Trial</h3>
                <p style="color: #d1d5db; font-size: 14px; margin: 0;">
                  You've received <strong style="color: #fbbf24;">10 free credits</strong> to explore our tools. Use them to generate storyboards, analyze scripts, create pitch decks, and more!
                </p>
              </div>
              
              <h3 style="color: #ffffff; font-size: 18px; margin: 30px 0 15px 0;">Popular Tools to Try:</h3>
              
              <div style="margin: 15px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <span style="color: #fbbf24; margin-right: 10px;">📝</span>
                  <span style="color: #d1d5db;"><strong style="color: #ffffff;">Script Analysis</strong> - Get AI-powered insights on your screenplay</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <span style="color: #fbbf24; margin-right: 10px;">🎨</span>
                  <span style="color: #d1d5db;"><strong style="color: #ffffff;">Storyboard Generator</strong> - Visualize your scenes with AI</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <span style="color: #fbbf24; margin-right: 10px;">📊</span>
                  <span style="color: #d1d5db;"><strong style="color: #ffffff;">Pitch Deck Maker</strong> - Create professional pitch materials</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="color: #fbbf24; margin-right: 10px;">📋</span>
                  <span style="color: #d1d5db;"><strong style="color: #ffffff;">Call Sheet Generator</strong> - Organize your production</span>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://filmmakergenius.com/toolbox" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #0a0a0a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Start Creating →
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
              <p style="margin: 0 0 10px 0;">© 2026 FilmMaker Genius. All rights reserved.</p>
              <p style="margin: 0;">Questions? Reply to this email - we're here to help!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
