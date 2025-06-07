// utils/pdfReceiptGenerator.ts
import jsPDF from 'jspdf';
import { Order } from '@/models/OrderModel';
import { fetchOrderById } from '@/services/orderService';

interface ToastFunction {
  (options: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
  }): void;
}

export const generateAndDownloadReceipt = async (
  order: Order, 
  toast: ToastFunction
): Promise<void> => {
  try {
    // Fetch full order details if needed
    const orderData = await fetchOrderById(order.id);
    const fullOrder = typeof orderData.order === 'string' ? JSON.parse(orderData.order) : orderData.order;
    
    // Create new PDF document
    const pdf = new jsPDF();
    
    // Set font
    pdf.setFont('helvetica');
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text('*** YOO BOBA ***', 105, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text('Thank you for your order!', 105, 30, { align: 'center' });
    
    // Draw separator line
    pdf.line(20, 35, 190, 35);
    
    let yPosition = 50;
    
    // Order Info
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    pdf.text(`Order #: ${fullOrder.id.toString().slice(-8)}`, 20, yPosition);
    pdf.text(`Date: ${new Date(fullOrder.created_at).toLocaleDateString()}`, 20, yPosition + 10);
    pdf.text(`Status: ${fullOrder.status?.toUpperCase()}`, 20, yPosition + 20);
    
    yPosition += 35;
    
    // Draw separator
    pdf.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Customer Info
    pdf.setFontSize(11);
    pdf.text('Customer:', 20, yPosition);
    yPosition += 8;
    
    const customer = fullOrder.customer;
    const customerName = `${customer?.firstName || customer?.first_name || ''} ${customer?.lastName || customer?.last_name || ''}`.trim();
    const customerEmail = customer?.email || customer?.emailaddress || 'N/A';
    const customerPhone = customer?.phone || customer?.contactno || 'N/A';
    
    pdf.text(customerName, 20, yPosition);
    pdf.text(customerEmail, 20, yPosition + 8);
    pdf.text(customerPhone, 20, yPosition + 16);
    
    yPosition += 30;
    
    // Draw separator
    pdf.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Items
    pdf.setFontSize(11);
    pdf.text('Items:', 20, yPosition);
    yPosition += 10;
    
    interface OrderItem {
      name?: string;
      quantity?: number;
      price?: number | string;
    }
    
    const items: OrderItem[] = fullOrder.items || [];
    items.forEach((item: OrderItem) => {
      const itemName = item.name || 'N/A';
      const quantity = item.quantity || 0;
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price || 0;
      const totalPrice = (price * quantity).toFixed(2);
      
      pdf.text(itemName, 20, yPosition);
      pdf.text(`${quantity} x Rs.${price}`, 20, yPosition + 8);
      pdf.text(`Rs.${totalPrice}`, 150, yPosition + 8);
      
      yPosition += 20;
    });
    
    // Draw separator
    pdf.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Total
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    const totalAmount = fullOrder.total_amount || fullOrder.total || 0;
    pdf.text(`TOTAL: Rs.${totalAmount}`, 20, yPosition);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const paymentMethod = fullOrder.payment_method || fullOrder.paymentMethod || 'N/A';
    pdf.text(`Payment: ${paymentMethod}`, 20, yPosition + 10);
    
    yPosition += 25;
    
    // Shipping Address
    if (fullOrder.shippingAddress) {
      pdf.setFontSize(11);
      pdf.text('Shipping to:', 20, yPosition);
      yPosition += 8;
      
      const address = fullOrder.shippingAddress;
      pdf.setFontSize(10);
      pdf.text(address.street1 || 'N/A', 20, yPosition);
      if (address.street2) {
        yPosition += 8;
        pdf.text(address.street2, 20, yPosition);
      }
      yPosition += 8;
      pdf.text(`${address.city || 'N/A'}, ${address.state || 'N/A'}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`${address.zipCode || 'N/A'}, ${address.country || 'N/A'}`, 20, yPosition);
      
      yPosition += 15;
    }
    
    // Footer
    pdf.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Thank you for choosing YOO BOBA! 🎉', 105, yPosition, { align: 'center' });
    pdf.text('Have a bubble-icious day! ✨', 105, yPosition + 8, { align: 'center' });
    
    // Save the PDF
    const fileName = `YooBoba_Receipt_${fullOrder.id.toString().slice(-8)}.pdf`;
    pdf.save(fileName);
    
    toast({
      title: "Download Started",
      description: `Receipt for order #${fullOrder.id} has been downloaded.`,
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast({
      title: "Download Failed",
      description: "There was an error generating the receipt. Please try again.",
      variant: "destructive",
    });
  }
};