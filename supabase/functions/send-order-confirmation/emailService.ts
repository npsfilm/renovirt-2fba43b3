
import { Resend } from "npm:resend@2.0.0";
import { generateEmailHTML } from './emailTemplate.ts';
import { getEstimatedDelivery, getCustomerGreeting, generateExtrasHtml } from './utils.ts';
import type { OrderConfirmationRequest, EmailTemplateData } from './types.ts';

export class EmailService {
  private resend: Resend;

  constructor() {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }
    this.resend = new Resend(resendApiKey);
  }

  private prepareEmailData(orderNumber: string, orderDetails: OrderConfirmationRequest['orderDetails']): EmailTemplateData {
    const estimatedDelivery = getEstimatedDelivery(orderDetails.extras);
    const customerGreeting = getCustomerGreeting(orderDetails);
    const extrasHtml = generateExtrasHtml(orderDetails.extras);

    // Map photo type IDs to readable labels
    const photoTypeLabels: Record<string, string> = {
      'handy': 'Handy',
      'kamera': 'Kamera', 
      'bracketing-3': 'Bracketing (3 Bilder)',
      'bracketing-5': 'Bracketing (5 Bilder)'
    };

    const readablePhotoType = photoTypeLabels[orderDetails.photoType] || orderDetails.photoType;

    return {
      orderNumber,
      customerGreeting,
      estimatedDelivery,
      orderDetails: {
        ...orderDetails,
        photoType: readablePhotoType
      },
      extrasHtml,
      currentYear: new Date().getFullYear()
    };
  }

  async sendOrderConfirmation(orderNumber: string, customerEmail: string, orderDetails: OrderConfirmationRequest['orderDetails']) {
    // Validate email address
    if (!customerEmail || typeof customerEmail !== 'string' || customerEmail.trim().length === 0) {
      const error = `Invalid customerEmail provided: "${customerEmail}" for order ${orderNumber}`;
      console.error(error);
      throw new Error(`Ungültige E-Mail-Adresse: ${customerEmail || 'leer'}`);
    }

    const trimmedEmail = customerEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      const error = `Invalid email format: "${trimmedEmail}" for order ${orderNumber}`;
      console.error(error);
      throw new Error(`Ungültiges E-Mail-Format: ${trimmedEmail}`);
    }

    console.log(`Preparing email for order ${orderNumber} to ${trimmedEmail}`);
    console.log('Order details:', JSON.stringify(orderDetails, null, 2));

    const emailData = this.prepareEmailData(orderNumber, orderDetails);
    const htmlContent = generateEmailHTML(emailData);

    console.log(`Sending email to: [${trimmedEmail}]`);
    const emailResponse = await this.resend.emails.send({
      from: "Renovirt <info@renovirt.de>",
      to: [trimmedEmail],
      subject: `Renovirt – Bestellbestätigung ${orderNumber}`,
      html: htmlContent,
    });

    console.log("Professionelle Bestellbestätigung E-Mail erfolgreich gesendet:", emailResponse);
    return emailResponse;
  }

  static checkConfiguration(): { success: boolean; message?: string } {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return {
        success: false,
        message: "E-Mail-Service nicht konfiguriert"
      };
    }
    return { success: true };
  }
}
