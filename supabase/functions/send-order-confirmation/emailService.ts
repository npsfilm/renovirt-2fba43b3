
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

    return {
      orderNumber,
      customerGreeting,
      estimatedDelivery,
      orderDetails,
      extrasHtml,
      currentYear: new Date().getFullYear()
    };
  }

  async sendOrderConfirmation(orderNumber: string, customerEmail: string, orderDetails: OrderConfirmationRequest['orderDetails']) {
    const emailData = this.prepareEmailData(orderNumber, orderDetails);
    const htmlContent = generateEmailHTML(emailData);

    const emailResponse = await this.resend.emails.send({
      from: "Renovirt <info@renovirt.de>",
      to: [customerEmail],
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
