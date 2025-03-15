import { config } from './config';
import { requestGraphQL } from './graphql/client';
import { getOrdersQuery } from './graphql/queries';
import { Order, Customer } from './types/types';

// Response shape from Shopify GraphQL API for orders
interface OrdersResponse {
  orders: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: Array<{ node: Order }>;
  };
}

// Fetches all orders matching the query with pagination
async function fetchOrders(query: string, pageSize: number = 100): Promise<Order[]> {
  const orders: Order[] = [];
  let cursor: string | null = null;

  // Continue fetching until no more pages remain
  while (true) {
    const response: OrdersResponse = await requestGraphQL<OrdersResponse>(getOrdersQuery(pageSize, query, cursor), {
      first: pageSize,
      query,
      after: cursor,
    });

    const pageOrders = response.orders.edges.map(edge => edge.node);
    orders.push(...pageOrders);

    const { hasNextPage, endCursor } = response.orders.pageInfo;
    if (!hasNextPage) break;
    cursor = endCursor;
  }

  return orders;
}

// Formats customer name, defaulting to 'Unknown' if missing
function getCustomerName(customer: Customer | null): string {
  const first = customer?.firstName ?? '';
  const last = customer?.lastName ?? '';
  return first || last ? `${first} ${last}`.trim() : 'Unknown';
}

// Displays order details for matching line items
function printOrderDetails(order: Order, targetProductGid: string): void {
  const matchingItems = order.lineItems.edges.filter(edge => edge.node.product?.id === targetProductGid);
  if (matchingItems.length === 0) return;

  const totalQuantity = matchingItems.reduce((sum, edge) => sum + edge.node.quantity, 0);
  const productTitle = matchingItems[0].node.product!.title;

  console.log(`Order ID: ${order.name}`);
  console.log(`Customer: ${getCustomerName(order.customer)}`);
  console.log(`Product ID: ${config.productId}`);
  console.log(`Product Title: ${productTitle}`);
  console.log(`Total Quantity: ${totalQuantity}`);
  console.log('---');
}

// Main execution logic
async function main(): Promise<void> {
  try {
    // Calculate date 30 days ago for query filter
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const formattedDate = thirtyDaysAgo.toISOString().split('T')[0];
    const query = `created_at:>${formattedDate} line_items.product_id:${config.productId}`;
    const targetProductGid = `gid://shopify/Product/${config.productId}`;

    const orders = await fetchOrders(query);
    orders.forEach(order => printOrderDetails(order, targetProductGid));
  } catch (error) {
    console.error('Error fetching orders:', (error as Error).message);
  }
}

main();