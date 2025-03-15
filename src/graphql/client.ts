import { shopify } from '../shopify-client';

// Executes GraphQL requests using shopify-api-node
export async function requestGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  try {
    return await shopify.graphql(query, variables);
  } catch (error) {
    throw new Error(`GraphQL Request Failed: ${(error as Error).message}`);
  }
}