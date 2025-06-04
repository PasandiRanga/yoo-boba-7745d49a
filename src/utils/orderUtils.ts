import { DatabaseOrderResponse, Order, Address } from "@/types/order";

export const transformDatabaseOrder = (dbResponse: DatabaseOrderResponse): Order => {
  const dbOrder = dbResponse.order;
  
  return {
    id: dbOrder.id,
    customer: {
      firstName: dbOrder.customer.first_name,
      lastName: dbOrder.customer.last_name,
      email: dbOrder.customer.email || dbOrder.customer.emailaddress,
      phone: dbOrder.customer.phone || dbOrder.customer.contactno,
      company: dbOrder.customer.company,
      userId: dbOrder.customer.user_id,
    },
    shippingAddress: {
      street1: dbOrder.shippingAddress.street1,
      street2: dbOrder.shippingAddress.street2,
      city: dbOrder.shippingAddress.city,
      state: dbOrder.shippingAddress.state,
      zipCode: dbOrder.shippingAddress.zipCode,
      country: dbOrder.shippingAddress.country,
    },
    billingAddress: {
      street1: dbOrder.billingAddress.street1,
      street2: dbOrder.billingAddress.street2,
      city: dbOrder.billingAddress.city,
      state: dbOrder.billingAddress.state,
      zipCode: dbOrder.billingAddress.zipCode,
      country: dbOrder.billingAddress.country,
    },
    items: dbOrder.items.map(item => ({
      productId: item.product_id,
      name: item.name,
      price: parseFloat(item.price),
      quantity: item.quantity,
    })),
    total: parseFloat(dbOrder.total_amount),
    status: dbOrder.status as Order["status"],
    paymentMethod: dbOrder.payment_method as Order["paymentMethod"],
    paymentStatus: dbOrder.payment_status as Order["paymentStatus"],
    paymentId: dbOrder.payment_id,
    createdAt: new Date(dbOrder.created_at),
    updatedAt: new Date(dbOrder.updated_at),
    isGuestOrder: dbOrder.is_guest_order,
  };
};

export const formatAddress = (address: Address | undefined | null): string => {
  if (!address) return "N/A";
  const parts = [
    address.street1,
    address.street2,
    address.city,
    address.state,
    address.zipCode,
    address.country
  ].filter(Boolean);
  return parts.join(", ");
};

export const capitalize = (str: string | undefined): string => {
  if (!str) return "N/A";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getCustomerName = (customer: Order["customer"] | undefined, isGuestOrder: boolean): string => {
  if (!customer) return "N/A";
  return `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 
         (isGuestOrder ? "Guest User" : "Registered User");
};

export const getCustomerEmail = (customer: Order["customer"] | undefined): string => {
  if (!customer) return "N/A";
  return customer.email || "N/A";
};

export const getCustomerPhone = (customer: Order["customer"] | undefined): string => {
  if (!customer) return "N/A";
  return customer.phone || "N/A";
}; 