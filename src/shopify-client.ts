import Shopify from 'shopify-api-node';
import { config } from './config';

// Single Shopify client instance for the app
export const shopify = new Shopify({
  shopName: config.shop.split('.')[0], // Extracts "my-dev-store" from "my-dev-store.myshopify.com"
  accessToken: config.accessToken,
  apiVersion: config.apiVersion,
});