// Mock data layer — stands in for Shopify/GoHighLevel/Zendesk in the demo.
// Swap this module for real API calls in production; the endpoint shapes below
// (found / found:false) stay identical either way.

const customers = [
  { customerId: "CUST-1001", name: "Amara Chen", email: "amara.chen@example.com", phone: "+1-555-0101" },
  { customerId: "CUST-1002", name: "Jordan Reyes", email: "jordan.reyes@example.com", phone: "+1-555-0102" },
  { customerId: "CUST-1003", name: "Priya Nair", email: "priya.nair@example.com", phone: "+1-555-0103" },
];

const orders = [
  {
    orderId: "ORD-8841",
    customerId: "CUST-1001",
    items: [{ sku: "SKU-GLOW-30", name: "Glow Serum 30ml", qty: 1, price: 48.0 }],
    status: "shipped",
    carrier: "UPS",
    trackingNumber: "1Z999AA10123456784",
    shippedAt: "2026-07-20",
    estimatedDelivery: "2026-07-25",
    total: 48.0,
  },
  {
    orderId: "ORD-8842",
    customerId: "CUST-1002",
    items: [{ sku: "SKU-VITC-50", name: "Vitamin C Cream 50ml", qty: 2, price: 32.0 }],
    status: "delayed",
    carrier: "USPS",
    trackingNumber: "9400111899223344556677",
    shippedAt: "2026-07-15",
    estimatedDelivery: "2026-07-22",
    delayReason: "carrier weather delay",
    total: 64.0,
  },
  {
    // Deliberately belongs to CUST-1001, not CUST-1002 — use this to test that
    // customer-scoped lookups don't leak data across customers.
    orderId: "ORD-8843",
    customerId: "CUST-1001",
    items: [{ sku: "SKU-RETN-15", name: "Retinol Night Treatment 15ml", qty: 1, price: 56.0 }],
    status: "returned",
    returnReason: "customer changed mind",
    returnedAt: "2026-07-18",
    refundStatus: "processed",
    refundAmount: 56.0,
    total: 56.0,
  },
  {
    orderId: "ORD-8844",
    customerId: "CUST-1003",
    items: [{ sku: "SKU-SPF-50", name: "Mineral SPF 50", qty: 3, price: 22.0 }],
    status: "cancelled",
    cancelReason: "customer requested cancellation before fulfillment",
    cancelledAt: "2026-07-19",
    total: 66.0,
  },
  {
    // Multi-item order — forces array handling, not a single-item shortcut.
    orderId: "ORD-8845",
    customerId: "CUST-1003",
    items: [
      { sku: "SKU-GLOW-30", name: "Glow Serum 30ml", qty: 1, price: 48.0 },
      { sku: "SKU-SPF-50", name: "Mineral SPF 50", qty: 1, price: 22.0 },
    ],
    status: "processing",
    estimatedShipDate: "2026-07-26",
    total: 70.0,
  },
  // NOTE: ORD-9999 is intentionally absent — use it to test the not-found path.
];

const policies = {
  returns: "Items may be returned within 30 days of delivery if unused and in original packaging. Refunds are issued to the original payment method within 5-7 business days of us receiving the return.",
  refunds: "Refunds are processed within 5-7 business days after the returned item is received and inspected. Shipping fees are non-refundable unless the return is due to our error.",
  shipping: "Standard shipping takes 4-6 business days within the US. Expedited shipping (2-3 business days) is available at checkout for an additional fee.",
  cancellations: "Orders can be cancelled free of charge before they enter fulfillment. Once an order has shipped, it cannot be cancelled — a return can be initiated instead.",
};

module.exports = { customers, orders, policies };
