import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { config } from '../config';
import { requestGraphQL } from '../graphql/client';
import { getProductQuery } from '../graphql/queries';
import { sendEmail } from '../email/email';
import { Product, WebhookPayload, Variant } from '../types/types';

// Express Setup
const app = express();

// Verifies Shopify webhook HMAC signature
function verifyWebhook(req: express.Request, buf: Buffer): void {
  const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string | undefined;
  if (!hmacHeader) throw new Error('Missing HMAC header');
  const generatedHmac = crypto
    .createHmac('sha256', config.webhookSecret)
    .update(buf)
    .digest('base64');
  if (generatedHmac !== hmacHeader) throw new Error('Invalid HMAC');
}

// Body Parser Middleware
app.use(bodyParser.json({ verify: (req, _, buf) => verifyWebhook(req as express.Request, buf) }));

// Generates price drop logic alert if decrease > 20%
function generatePriceAlert(productTitle: string, variant: Variant): string | null {
  const newPrice = parseFloat(variant.price);
  const oldPrice = variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : newPrice;
  if (oldPrice <= newPrice || newPrice >= oldPrice * 0.8) return null;

  const decrease = ((oldPrice - newPrice) / oldPrice) * 100;
  return `
    Alert: Price decrease for product "${productTitle}"
    Variant: "${variant.title}"
    Old Price: ${oldPrice}
    New Price: ${newPrice}
    Percentage Decrease: ${decrease.toFixed(2)}%
  `.trim();
}

// Webhook Endpoint
app.post('/api/product-update', async (req: express.Request<{}, {}, WebhookPayload>, res) => {
  try {
    const product = req.body;
    console.log('Product updated:', JSON.stringify(product, null, 2));

    const gid = `gid://shopify/Product/${product.id}`;
    const data = await requestGraphQL<{ product: Product }>(getProductQuery(gid), { id: gid });
    const fetchedProduct = data.product;

    const alerts = fetchedProduct.variants.edges
      .map(edge => generatePriceAlert(fetchedProduct.title, edge.node))
      .filter((alert): alert is string => alert !== null);

    if (alerts.length > 0) {
      await sendEmail(`Price Drop Alert: ${fetchedProduct.title}`, alerts.join('\n---\n'));
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', (error as Error).message);
    res.sendStatus(200); // Acknowledge to prevent retries
  }
});

// Error Handling Middleware
app.use((err: Error, _: express.Request, res: express.Response, __: express.NextFunction) => {
  console.error('Webhook verification failed:', err.message);
  res.status(403).send('Webhook verification failed');
});

// Start the Server
app.listen(config.port, () => {
  console.log(`Webhook server running on port ${config.port}`);
});