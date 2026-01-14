import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContractData {
  date: string;
  producerName: string;
  investorName: string;
  filmTitle: string;
  investmentAmount: string;
  fundsUsedFor: string;
  recoupmentPercentage: string;
  creditTitle: string;
  creditPlacement: string;
  producerSignatory: string;
  companyLogo?: string;
}

interface EmailRecipient {
  email: string;
  note: string;
}

interface SendContractRequest {
  recipients: EmailRecipient[];
  contractData: ContractData;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "[Date]";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatCurrency = (amount: string): string => {
  if (!amount) return "[Amount]";
  const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

const generateEmailHTML = (data: ContractData, personalNote?: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Georgia, 'Times New Roman', serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 700px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background-color: #1e293b; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          ${data.companyLogo ? `
            <div style="margin-bottom: 16px;">
              <img src="${data.companyLogo}" alt="Company Logo" style="max-width: 200px; max-height: 60px; object-fit: contain;" />
            </div>
          ` : ''}
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Film Investment Agreement</h1>
          <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">
            For your review and signature
          </p>
        </div>
        
        <!-- Content -->
        <div style="background-color: #ffffff; padding: 32px; border-radius: 0 0 8px 8px;">
          ${personalNote ? `
            <div style="background-color: #f0f9ff; padding: 16px; border-radius: 6px; margin-bottom: 24px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af; font-style: italic;">"${personalNote}"</p>
            </div>
          ` : ''}
          
          <!-- Contract Content -->
          <div style="line-height: 1.8; color: #1e293b;">
            <h2 style="text-align: center; font-size: 20px; margin-bottom: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 16px;">
              FILM INVESTMENT AGREEMENT
            </h2>
            
            <p>This Agreement is entered into on this <strong>${formatDate(data.date)}</strong>, by and between:</p>
            
            <p><strong>${data.producerName || "[Your Production Company Name]"}</strong> ("Producer") and<br>
            <strong>${data.investorName || "[Investor Name/Entity]"}</strong> ("Investor").</p>

            <h3 style="color: #1e293b; margin-top: 24px;">1. The Project</h3>
            <p>The Investor agrees to provide capital for the production of the motion picture currently titled 
            "<strong>${data.filmTitle || "[Film Title]"}</strong>" (the "Project").</p>

            <h3 style="color: #1e293b; margin-top: 24px;">2. Investment Amount</h3>
            <p>The Investor agrees to provide a total investment of <strong>${formatCurrency(data.investmentAmount)}</strong> (the "Investment"). 
            These funds shall be used specifically for <strong>${data.fundsUsedFor}</strong> of the Project.</p>

            <h3 style="color: #1e293b; margin-top: 24px;">3. Recoupment (Getting Paid Back)</h3>
            <p>The "Gross Receipts" (money earned from the film) shall be distributed in the following order of priority:</p>
            <ol style="padding-left: 20px;">
              <li><strong>Expenses:</strong> Payment of sales agent fees, guild residuals, and distribution expenses.</li>
              <li><strong>Investor Recoupment:</strong> 100% of remaining funds go to the Investor(s) until they have recovered <strong>${data.recoupmentPercentage || "120"}%</strong> of their initial Investment.</li>
              <li><strong>Net Profits:</strong> Once the Investor has recouped ${data.recoupmentPercentage || "120"}%, the remaining "Net Profits" are typically split 50/50 between the "Investor Pool" and the "Producer Pool."</li>
            </ol>

            <h3 style="color: #1e293b; margin-top: 24px;">4. Credit</h3>
            <p>Provided that the Investment is paid in full, the Investor shall receive the following on-screen credit:</p>
            <ul style="padding-left: 20px;">
              <li><strong>Credit Title:</strong> ${data.creditTitle}</li>
              <li><strong>Placement:</strong> ${data.creditPlacement}</li>
            </ul>

            <h3 style="color: #1e293b; margin-top: 24px;">5. Rights and Control</h3>
            <ul style="padding-left: 20px;">
              <li><strong>Creative Control:</strong> The Producer retains all creative control over the Project, including casting, editing, and distribution decisions.</li>
              <li><strong>Ownership:</strong> The Investor acknowledges that this investment does not grant them ownership of the Intellectual Property (IP) or the copyright of the film.</li>
            </ul>

            <h3 style="color: #1e293b; margin-top: 24px;">6. Risk Disclosure</h3>
            <p>The Investor acknowledges that motion picture investments are highly speculative. There is no guarantee that the Project will be completed, distributed, or that any Investment will be recouped.</p>

            <h3 style="color: #1e293b; margin-top: 24px;">7. Signatures</h3>
            <div style="margin-top: 32px; padding: 24px; background-color: #f8fafc; border-radius: 8px;">
              <p style="margin-bottom: 24px;">
                Producer: _________________________ &nbsp;&nbsp;&nbsp; Date: __________<br>
                <span style="font-size: 12px; color: #64748b;">(Authorized Signatory for ${data.producerName || "[Company Name]"})</span>
              </p>
              <p>
                Investor: _________________________ &nbsp;&nbsp;&nbsp; Date: __________
              </p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 16px; color: #9ca3af; font-size: 11px;">
          <p style="margin: 0;">This document is a template for educational purposes only.</p>
          <p style="margin: 4px 0 0 0;">Consult a qualified entertainment attorney before signing.</p>
          <p style="margin: 8px 0 0 0;">Sent via Filmmaker Genius</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients, contractData }: SendContractRequest = await req.json();

    console.log(`Sending contract to ${recipients.length} recipients`);
    console.log(`Film: ${contractData.filmTitle}`);

    if (!recipients || recipients.length === 0) {
      throw new Error("At least one recipient email is required");
    }

    const emailPromises = recipients.map(recipient => {
      const html = generateEmailHTML(contractData, recipient.note);
      
      return resend.emails.send({
        from: "Filmmaker Genius <noreply@filmmakergenius.com>",
        to: [recipient.email.trim()],
        subject: `Film Investment Agreement - ${contractData.filmTitle || "For Review"}`,
        html,
      });
    });

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
        message: `Contract sent to ${successful} recipient(s)` 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contract function:", error);
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
