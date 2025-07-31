import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailChangeRequest {
  currentEmail: string;
  newEmail: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received email change request");
    
    const { currentEmail, newEmail, userId }: EmailChangeRequest = await req.json();

    if (!currentEmail || !newEmail || !userId) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Processing email change request for user ${userId}: ${currentEmail} -> ${newEmail}`);

    // Send email to support
    const emailResponse = await resend.emails.send({
      from: "Renovirt App <noreply@renovirt.de>",
      to: ["support@renovirt.de"],
      subject: "E-Mail-Änderungsanfrage von Kunde",
      html: `
        <h2>E-Mail-Änderungsanfrage</h2>
        <p><strong>Benutzer-ID:</strong> ${userId}</p>
        <p><strong>Aktuelle E-Mail:</strong> ${currentEmail}</p>
        <p><strong>Gewünschte neue E-Mail:</strong> ${newEmail}</p>
        <p><strong>Zeitpunkt der Anfrage:</strong> ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}</p>
        
        <h3>Nächste Schritte:</h3>
        <ol>
          <li>Identität des Kunden verifizieren</li>
          <li>E-Mail-Adresse in der Datenbank aktualisieren</li>
          <li>Kunden über die erfolgreiche Änderung informieren</li>
        </ol>
        
        <p><em>Diese Anfrage wurde automatisch von der Renovirt-App generiert.</em></p>
      `,
    });

    console.log("Support email sent successfully:", emailResponse);

    // Send confirmation email to customer
    const confirmationResponse = await resend.emails.send({
      from: "Renovirt Support <support@renovirt.de>",
      to: [currentEmail],
      subject: "Ihre E-Mail-Änderungsanfrage wurde empfangen",
      html: `
        <h2>E-Mail-Änderungsanfrage empfangen</h2>
        <p>Liebe Kundin, lieber Kunde,</p>
        
        <p>wir haben Ihre Anfrage zur Änderung Ihrer E-Mail-Adresse erhalten:</p>
        <ul>
          <li><strong>Von:</strong> ${currentEmail}</li>
          <li><strong>Zu:</strong> ${newEmail}</li>
        </ul>
        
        <p>Unser Support-Team wird Ihre Anfrage zeitnah bearbeiten und Sie über die weitere Vorgehensweise informieren.</p>
        
        <p>Falls Sie diese Anfrage nicht gestellt haben, wenden Sie sich bitte umgehend an unseren Support.</p>
        
        <p>Mit freundlichen Grüßen<br>
        Ihr Renovirt-Team</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          Renovirt<br>
          E-Mail: support@renovirt.de
        </p>
      `,
    });

    console.log("Confirmation email sent successfully:", confirmationResponse);

    return new Response(
      JSON.stringify({ 
        message: "Email change request sent successfully",
        supportEmailId: emailResponse.data?.id,
        confirmationEmailId: confirmationResponse.data?.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email-change-request function:", error);
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