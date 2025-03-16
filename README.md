# **Alumier Shopify Technical Test Interview**

## **YouTube video:** [https://youtu.be/f5-i8sHoTiY](https://youtu.be/f5-i8sHoTiY)

## **Overview**

This repository contains solutions for the Shopify Technical Test Interview @ Alumier:

1. **Liquid Snippet**: Displays an "On Sale" badge on discounted products in the product page.
2. **Shopify Admin API (GraphQL)**: Retrieves orders from the last 30 days containing a specific product ID using Shopify's GraphQL Admin API.
3. **Shopify Webhook**: Handles product update webhooks, logs details, and sends batched email alerts via Nodemailer when a product price decreases by more than 20% compared to its `compareAtPrice`.

## **Prerequisites**

- **Node.js 18+**: Verify with `node -v`.
- **npm**: Installed with Node.js for package management. Check with `npm -v`
- **ts-node (Global Installation)**: Required to run TypeScript files directly. Check with `ts-node -v`. Install globally with:
  `npm install -g ts-node`
- **Shopify Development Store**: With products and orders for testing.
- **Shopify Admin API Access Token**: With `read_orders`, `read_products` scopes.
- **ngrok**: For exposing the local webhook server. Install via `npm install -g ngrok` or `brew install --cask ngrok`.
- **SMTP Service**: An email service (e.g., Ethereal Email) for sending alerts via Nodemailer.

---

## **Project Setup**

#### 1: Clone the repository

```bash
git clone <repository-url>
cd alumier-technical-test
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure .env

```bash
SHOP=my-dev-store.myshopify.com
ACCESS_TOKEN=your_access_token_here
API_VERSION=2025-01
WEBHOOK_SECRET=your_webhook_secret_here
PORT=3000
PRODUCT_ID=1234567890
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-email@ethereal.email
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=your-email@@ethereal.email
EMAIL_TO=recipient@example.com
```

---

## **Task 1: Liquid Snippet**

#### 1. Locate:

- `liquid/product-badge.liquid`

#### 2. Copy to your Shopify theme:

- Online Store > Themes > Actions > Edit Code > Snippets > Add a new snippet > `product-badge`.
- Paste the contents.
- Include in `sections/product-template.liquid`

```bash
{% include 'product-badge' %}
```

#### 3. Testing

- Set product **Compare-at price > Price**.
- Check the product page for the "On Sale" badge.
- Test a non-discounted product (no badge).

---

## **Task 2: Shopify Admin API (GraphQL)**

#### 1. Ensure **PRODUCT_ID** is set in .env.

#### 2. Testing

1. Create an order with PRODUCT_ID in Shopify Admin.
2. Run

```bash
npm run get-orders
```

#### Output:

```bash
Order ID: #1001
Customer: Ayumu Hirano
Product ID: 10281035825486
Product Title: The Collection Snowboard: Liquid
Total Quantity: 5
---
```

---

## **Task 3: Shopify Webhook**

#### 1. Install ngrok

```bash
npm install -g ngrok
```

or

```bash
brew install --cask ngrok
```

#### 2. Start the server

```bash
npm run product-update-webhook
```

#### 3. Expose with ngrok

```bash
ngrok http 3000
```

#### 4. Configure webhook in Shopify Admin

- Settings > Notifications > Webhooks > Create webhook.
- Event: **Product Update**
- URL: https://your-ngrok-url.ngrok.io/api/product-update
- Format: **JSON**
- Secret: **Match WEBHOOK_SECRET**

#### 5. Testing

1. Update a product (e.g., compareAtPrice: £749.95, price: £300).
2. Check server logs for Product updated: {...}.
3. Verify email at **EMAIL_TO**:

```bash
Alert: Price decrease for product "The Collection Snowboard: Liquid"
Variant: "Default Title"
Old Price: 749.95
New Price: 300
Percentage Decrease: 60.00%
```

---
