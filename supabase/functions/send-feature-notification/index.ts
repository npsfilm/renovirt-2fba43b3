import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  feature_request_id: string;
  notification_type: 'status_change' | 'admin_response' | 'new_comment';
  details?: {
    old_status?: string;
    new_status?: string;
    admin_response?: string;
    comment_content?: string;
  };
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feature_request_id, notification_type, details }: NotificationRequest = await req.json();

    // Get feature request details
    const { data: featureRequest, error: frError } = await supabase
      .from('feature_requests')
      .select(`
        *,
        customer_profiles:created_by(first_name, last_name, user_id),
        feature_categories(name)
      `)
      .eq('id', feature_request_id)
      .single();

    if (frError || !featureRequest) {
      throw new Error('Feature request not found');
    }

    // Get user's auth email
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(
      featureRequest.customer_profiles?.user_id
    );

    if (authError || !authUser) {
      throw new Error('User not found');
    }

    const userEmail = authUser.user.email;
    const userName = featureRequest.customer_profiles 
      ? `${featureRequest.customer_profiles.first_name} ${featureRequest.customer_profiles.last_name}`
      : 'Geschätzter Nutzer';

    // Generate email content based on notification type
    let subject = '';
    let html = '';

    switch (notification_type) {
      case 'status_change':
        subject = `Status-Update: ${featureRequest.title}`;
        html = generateStatusChangeEmail(featureRequest, details, userName);
        break;
      
      case 'admin_response':
        subject = `Admin-Antwort: ${featureRequest.title}`;
        html = generateAdminResponseEmail(featureRequest, details, userName);
        break;
      
      case 'new_comment':
        subject = `Neuer Kommentar: ${featureRequest.title}`;
        html = generateNewCommentEmail(featureRequest, details, userName);
        break;
      
      default:
        throw new Error('Invalid notification type');
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Feature Requests <noreply@renovirt.com>",
      to: [userEmail],
      subject,
      html,
    });

    console.log("Notification email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-feature-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateStatusChangeEmail(featureRequest: any, details: any, userName: string): string {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Abgeschlossen';
      case 'in_progress': return 'In Bearbeitung';
      case 'planned': return 'Geplant';
      case 'under_review': return 'Wird überprüft';
      case 'rejected': return 'Abgelehnt';
      default: return 'Offen';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#3B82F6';
      case 'planned': return '#8B5CF6';
      case 'under_review': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Status-Update</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 32px; border-radius: 8px; margin-top: 32px; margin-bottom: 32px;">
        <h1 style="color: #1f2937; margin-bottom: 24px;">Status-Update für Ihren Feature-Request</h1>
        
        <p>Hallo ${userName},</p>
        
        <p>der Status Ihres Feature-Requests wurde aktualisiert:</p>
        
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <h2 style="margin: 0 0 16px 0; color: #1f2937;">${featureRequest.title}</h2>
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
            <span style="background-color: ${getStatusColor(details?.new_status)}; color: white; padding: 4px 12px; border-radius: 16px; font-size: 14px; font-weight: 500;">
              ${getStatusLabel(details?.new_status)}
            </span>
            ${featureRequest.feature_categories ? `
              <span style="border: 1px solid #d1d5db; color: #6b7280; padding: 4px 12px; border-radius: 16px; font-size: 14px;">
                ${featureRequest.feature_categories.name}
              </span>
            ` : ''}
          </div>
          <p style="margin: 0; color: #6b7280;">${featureRequest.description}</p>
        </div>
        
        ${featureRequest.admin_response ? `
          <div style="border-left: 4px solid #3b82f6; background-color: #eff6ff; padding: 16px; margin: 24px 0;">
            <h3 style="margin: 0 0 8px 0; color: #1e40af;">Admin-Antwort:</h3>
            <p style="margin: 0; color: #1f2937;">${featureRequest.admin_response}</p>
          </div>
        ` : ''}
        
        ${featureRequest.estimated_completion ? `
          <p style="background-color: #ecfdf5; border: 1px solid #d1fae5; color: #065f46; padding: 12px; border-radius: 6px;">
            <strong>Geschätzte Fertigstellung:</strong> ${featureRequest.estimated_completion}
          </p>
        ` : ''}
        
        <p>Vielen Dank für Ihr Feedback und Ihre Geduld!</p>
        
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>Mit freundlichen Grüßen,<br>Das Renovirt Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAdminResponseEmail(featureRequest: any, details: any, userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin-Antwort</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 32px; border-radius: 8px; margin-top: 32px; margin-bottom: 32px;">
        <h1 style="color: #1f2937; margin-bottom: 24px;">Neue Admin-Antwort</h1>
        
        <p>Hallo ${userName},</p>
        
        <p>es gibt eine neue Antwort von unserem Team zu Ihrem Feature-Request:</p>
        
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <h2 style="margin: 0 0 16px 0; color: #1f2937;">${featureRequest.title}</h2>
          <p style="margin: 0 0 16px 0; color: #6b7280;">${featureRequest.description}</p>
        </div>
        
        <div style="border-left: 4px solid #3b82f6; background-color: #eff6ff; padding: 16px; margin: 24px 0;">
          <h3 style="margin: 0 0 12px 0; color: #1e40af;">Admin-Antwort:</h3>
          <p style="margin: 0; color: #1f2937; white-space: pre-wrap;">${details?.admin_response}</p>
        </div>
        
        <p>Vielen Dank für Ihr Feedback!</p>
        
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>Mit freundlichen Grüßen,<br>Das Renovirt Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateNewCommentEmail(featureRequest: any, details: any, userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Neuer Kommentar</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 32px; border-radius: 8px; margin-top: 32px; margin-bottom: 32px;">
        <h1 style="color: #1f2937; margin-bottom: 24px;">Neuer Kommentar</h1>
        
        <p>Hallo ${userName},</p>
        
        <p>es gibt einen neuen Kommentar zu Ihrem Feature-Request:</p>
        
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <h2 style="margin: 0 0 16px 0; color: #1f2937;">${featureRequest.title}</h2>
        </div>
        
        <div style="background-color: #fafafa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <h3 style="margin: 0 0 8px 0; color: #374151;">Neuer Kommentar:</h3>
          <p style="margin: 0; color: #1f2937; white-space: pre-wrap;">${details?.comment_content}</p>
        </div>
        
        <p>Besuchen Sie die Feature-Request-Seite, um an der Diskussion teilzunehmen.</p>
        
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>Mit freundlichen Grüßen,<br>Das Renovirt Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);