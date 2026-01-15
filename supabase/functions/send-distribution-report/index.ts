import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportEmailRequest {
  recipients: string[];
  projectTitle: string;
  finalScore: number;
  readinessBand: string;
  businessScore: number;
  legalScore: number;
  technicalScore: number;
  pdfBase64?: string;
  companyLogoUrl?: string;
  senderName?: string;
  customMessage?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const data: ReportEmailRequest = await req.json();
    const { 
      recipients, 
      projectTitle, 
      finalScore, 
      readinessBand,
      businessScore,
      legalScore,
      technicalScore,
      pdfBase64,
      senderName,
      customMessage
    } = data;

    if (!recipients || recipients.length === 0) {
      throw new Error("No recipients provided");
    }

    // Get score color
    const getScoreColorHex = (score: number): string => {
      if (score >= 80) return '#22c55e';
      if (score >= 60) return '#3b82f6';
      if (score >= 40) return '#f59e0b';
      return '#ef4444';
    };

    const scoreColor = getScoreColorHex(finalScore);

    // Build HTML email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Distribution Readiness Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">Distribution Readiness Report</h1>
              <p style="color: #9ca3af; margin: 0; font-size: 18px;">${projectTitle || 'Your Project'}</p>
            </td>
          </tr>
          
          <!-- Score Section -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="display: inline-block; width: 120px; height: 120px; border-radius: 50%; background-color: ${scoreColor}; line-height: 120px;">
                <span style="color: #ffffff; font-size: 48px; font-weight: 800;">${finalScore}</span>
              </div>
              <p style="color: ${scoreColor}; font-size: 18px; font-weight: 600; margin: 16px 0 0 0;">${readinessBand}</p>
            </td>
          </tr>
          
          <!-- Pillar Scores -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" style="text-align: center; padding: 20px 10px; background-color: #3b82f6; border-radius: 8px 0 0 8px;">
                    <div style="color: #ffffff; font-size: 28px; font-weight: 700;">${businessScore}</div>
                    <div style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 4px;">Business</div>
                  </td>
                  <td width="33%" style="text-align: center; padding: 20px 10px; background-color: #a855f7;">
                    <div style="color: #ffffff; font-size: 28px; font-weight: 700;">${legalScore}</div>
                    <div style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 4px;">Legal</div>
                  </td>
                  <td width="33%" style="text-align: center; padding: 20px 10px; background-color: #14b8a6; border-radius: 0 8px 8px 0;">
                    <div style="color: #ffffff; font-size: 28px; font-weight: 700;">${technicalScore}</div>
                    <div style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 4px;">Technical</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          ${customMessage ? `
          <!-- Custom Message -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                <p style="color: #374151; margin: 0; font-size: 14px; line-height: 1.6;">${customMessage}</p>
                ${senderName ? `<p style="color: #6b7280; margin: 16px 0 0 0; font-size: 13px;">— ${senderName}</p>` : ''}
              </div>
            </td>
          </tr>
          ` : ''}
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px 0;">
                ${pdfBase64 ? 'Full report attached as PDF.' : 'View the full report on Filmmaker Genius.'}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Generated by <strong>Filmmaker Genius</strong><br>
                Distribution Readiness Assessment Tool
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Prepare attachments if PDF provided
    const attachments = pdfBase64 ? [
      {
        filename: `Distribution_Readiness_${projectTitle?.replace(/[^a-zA-Z0-9]/g, '_') || 'Report'}.pdf`,
        content: pdfBase64
      }
    ] : undefined;

    // Send email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Filmmaker Genius <noreply@filmmakergenius.com>",
        to: recipients,
        subject: `Distribution Readiness Report: ${projectTitle || 'Your Project'} (Score: ${finalScore})`,
        html: htmlContent,
        attachments
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const result = await response.json();
    
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("send-distribution-report error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
