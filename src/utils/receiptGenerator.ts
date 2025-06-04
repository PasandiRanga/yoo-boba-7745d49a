import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Order } from "@/types/order";
import { getCustomerName, getCustomerEmail, getCustomerPhone, formatAddress, capitalize } from "./orderUtils";
import { toast } from "@/components/ui/use-toast";

export const generateReceipt = async (order: Order | null, setIsGeneratingReceipt: (value: boolean) => void) => {
  if (!order) return;

  try {
    setIsGeneratingReceipt(true);
    
    // Create a temporary div with only the essential receipt content
    const receiptContent = document.createElement("div");
    receiptContent.style.padding = "20px";
    receiptContent.style.backgroundColor = "white";
    receiptContent.style.color = "black";
    receiptContent.style.maxWidth = "800px";
    receiptContent.style.margin = "0 auto";

    // Add company header
    const header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.marginBottom = "20px";
    header.innerHTML = `
      <h1 style="font-size: 24px; font-weight: bold; color: #7e22ce;">YooBoba</h1>
      <p style="font-size: 16px; color: #6b7280;">Order Receipt</p>
      <hr style="border: 1px solid #e5e7eb; margin: 10px 0;">
    `;
    receiptContent.appendChild(header);

    // Add order summary
    const orderSummary = document.createElement("div");
    orderSummary.style.marginBottom = "20px";
    orderSummary.innerHTML = `
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #7e22ce;">Order Summary</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <p><strong>Order Number:</strong> ${order.id || "N/A"}</p>
          <p><strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>
          <p><strong>Status:</strong> ${order.status ? capitalize(order.status) : "N/A"}</p>
        </div>
        <div>
          <p><strong>Payment Method:</strong> ${order.paymentMethod ? order.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus ? capitalize(order.paymentStatus) : "N/A"}</p>
          <p><strong>Total Amount:</strong> LKR ${order.total?.toFixed(2) || "0.00"}</p>
        </div>
      </div>
    `;
    receiptContent.appendChild(orderSummary);

    // Add customer information
    const customerInfo = document.createElement("div");
    customerInfo.style.marginBottom = "20px";
    customerInfo.innerHTML = `
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #7e22ce;">Customer Information</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <p><strong>Name:</strong> ${getCustomerName(order.customer, order.isGuestOrder)}</p>
          <p><strong>Email:</strong> ${getCustomerEmail(order.customer)}</p>
        </div>
        <div>
          <p><strong>Phone:</strong> ${getCustomerPhone(order.customer)}</p>
          ${order.customer.company ? `<p><strong>Company:</strong> ${order.customer.company}</p>` : ''}
        </div>
      </div>
    `;
    receiptContent.appendChild(customerInfo);

    // Add addresses if they exist
    if (order.shippingAddress) {
      const shippingAddress = document.createElement("div");
      shippingAddress.style.marginBottom = "20px";
      shippingAddress.innerHTML = `
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #7e22ce;">Shipping Address</h2>
        <p>${formatAddress(order.shippingAddress)}</p>
      `;
      receiptContent.appendChild(shippingAddress);
    }

    if (order.billingAddress) {
      const billingAddress = document.createElement("div");
      billingAddress.style.marginBottom = "20px";
      billingAddress.innerHTML = `
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #7e22ce;">Billing Address</h2>
        <p>${formatAddress(order.billingAddress)}</p>
      `;
      receiptContent.appendChild(billingAddress);
    }

    // Add order items table
    if (order.items && order.items.length > 0) {
      const itemsTable = document.createElement("div");
      itemsTable.style.marginBottom = "20px";
      
      let itemsHTML = `
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #7e22ce;">Order Items</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3e8ff;">
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
              <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Price</th>
              <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
              <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
      `;

      order.items.forEach(item => {
        itemsHTML += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">LKR ${item.price.toFixed(2)}</td>
            <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">LKR ${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `;
      });

      itemsHTML += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">LKR ${order.total?.toFixed(2) || "0.00"}</td>
            </tr>
          </tfoot>
        </table>
      `;

      itemsTable.innerHTML = itemsHTML;
      receiptContent.appendChild(itemsTable);
    }

    // Add footer
    const footer = document.createElement("div");
    footer.style.textAlign = "center";
    footer.style.marginTop = "20px";
    footer.style.paddingTop = "10px";
    footer.style.borderTop = "1px solid #e5e7eb";
    footer.style.color = "#6b7280";
    footer.innerHTML = `
      <p>Thank you for your order!</p>
      <p>YooBoba  • ${new Date().getFullYear()}</p>
    `;
    receiptContent.appendChild(footer);

    // Add the temporary div to the body
    document.body.appendChild(receiptContent);

    // Generate the PDF
    const canvas = await html2canvas(receiptContent, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190; // Slightly smaller than A4 width
    const pageHeight = 277; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`YooBoba_Receipt_${order.id || "order"}.pdf`);

    // Clean up
    document.body.removeChild(receiptContent);

    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been successfully downloaded.",
    });
  } catch (error) {
    console.error("Error generating receipt:", error);
    toast({
      title: "Error Generating Receipt",
      description: "There was an error generating your receipt. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsGeneratingReceipt(false);
  }
}; 