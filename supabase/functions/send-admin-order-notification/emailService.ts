import { Resend } from "npm:resend@2.0.0";
import { generateAdminEmailHTML } from './emailTemplate.ts';
import { 
  formatCurrency, 
  formatPaymentMethod, 
  formatPaymentStatus,
  generateExtrasHtml, 
  generateSpecialRequestsHtml,
  getCustomerDisplayName 
} from './utils.ts';
import type { AdminOrderNotificationRequest, AdminEmailTemplateData } from './types.ts';

export class EmailService {
  private resend: Resend;

  constructor() {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }
    this.resend = new Resend(resendApiKey);
  }

  private prepareAdminEmailData(
    orderNumber: string, 
    orderDetails: AdminOrderNotificationRequest['orderDetails'],
    customerDetails: AdminOrderNotificationRequest['customerDetails'],
    paymentDetails: AdminOrderNotificationRequest['paymentDetails']
  ): AdminEmailTemplateData {
    const customerName = getCustomerDisplayName(customerDetails);
    const extrasHtml = generateExtrasHtml(orderDetails.extras);
    const specialRequestsHtml = generateSpecialRequestsHtml(orderDetails.specialRequests);
    
    return {
      orderNumber,
      customerName,
      customerEmail: customerDetails.customerEmail,
      customerCompany: customerDetails.company,
      packageName: orderDetails.packageName,
      photoType: orderDetails.photoType,
      imageCount: orderDetails.imageCount,
      totalPrice: orderDetails.totalPrice,
      paymentMethod: formatPaymentMethod(paymentDetails.paymentMethod),
      paymentStatus: formatPaymentStatus(paymentDetails.paymentStatus),
      extrasHtml,
      specialRequestsHtml,
      orderDate: new Date().toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      adminPanelUrl: `https://app.renovirt.de/admin/orders`,
      currentYear: new Date().getFullYear()
    };
  }

  async sendAdminOrderNotification(
    orderNumber: string, 
    orderDetails: AdminOrderNotificationRequest['orderDetails'],
    customerDetails: AdminOrderNotificationRequest['customerDetails'],
    paymentDetails: AdminOrderNotificationRequest['paymentDetails']
  ) {
    const emailData = this.prepareAdminEmailData(orderNumber, orderDetails, customerDetails, paymentDetails);
    const htmlContent = generateAdminEmailHTML(emailData);

    // Admin email address - could be made configurable
    const adminEmail = "info@renovirt.de";

    const emailResponse = await this.resend.emails.send({
      from: "Renovirt System <info@renovirt.de>",
      to: [adminEmail],
      subject: `🔔 Neue Bestellung ${orderNumber} - ${emailData.customerName}`,
      html: htmlContent,
    });

    console.log("Admin-Benachrichtigung erfolgreich gesendet:", emailResponse);
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