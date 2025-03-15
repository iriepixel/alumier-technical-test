// Consistent GraphQL types, unchanged but reformatted for clarity.

// Customer details
export interface Customer {
  firstName?: string;
  lastName?: string;
}

// Product within a line item
export interface LineItemProduct {
  id: string;
  title: string;
}

// Line item node
export interface LineItemNode {
  product: LineItemProduct | null;
  quantity: number;
}

// Line items collection
export interface LineItems {
  edges: Array<{ node: LineItemNode }>;
}

// Order structure
export interface Order {
  id: string;
  name: string;
  customer: Customer | null;
  lineItems: LineItems;
}

// Variant details
export interface Variant {
  id: string;
  title: string;
  price: string;
  compareAtPrice: string | null;
}

// Product structure
export interface Product {
  title: string;
  variants: {
    edges: Array<{ node: Variant }>;
  };
}

// Webhook payload
export interface WebhookPayload {
  id: number;
  title: string;
  variants: Array<{
    id: string;
    price: string;
    compareAtPrice: string | null;
  }>;
}