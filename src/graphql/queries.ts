// Builds query for fetching orders with pagination
export const getOrdersQuery = (first: number, query: string, after?: string | null): string => `
  query ($first: Int!, $query: String!, $after: String) {
    orders(first: $first, query: $query, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          customer {
            firstName
            lastName
          }
          lineItems(first: 10) {
            edges {
              node {
                product {
                  id
                  title
                }
                quantity
              }
            }
          }
        }
      }
    }
  }
`;

// Query to fetch product details by ID
export const getProductQuery = (id: string): string => `
  query ($id: ID!) {
    product(id: $id) {
      title
      variants(first: 10) {
        edges {
          node {
            id
            title
            price
            compareAtPrice
          }
        }
      }
    }
  }
`;