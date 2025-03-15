import 'dotenv/config';

interface Config {
  shop: string;
  accessToken: string;
  apiVersion: string;
  webhookSecret: string;
  port: number;
  productId: string;
  emailHost: string;
  emailPort: number;
  emailUser: string;
  emailPass: string;
  emailFrom: string;
  emailTo: string;
}

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} not defined in .env`);
  return value;
}

export const config: Config = {
  shop: getEnvVar('SHOP'),
  accessToken: getEnvVar('ACCESS_TOKEN'),
  apiVersion: getEnvVar('API_VERSION'),
  webhookSecret: getEnvVar('WEBHOOK_SECRET'),
  port: parseInt(process.env.PORT ?? '3000', 10),
  productId: getEnvVar('PRODUCT_ID'),
  emailHost: getEnvVar('EMAIL_HOST'),
  emailPort: parseInt(process.env.EMAIL_PORT ?? '587', 10),
  emailUser: getEnvVar('EMAIL_USER'),
  emailPass: getEnvVar('EMAIL_PASS'),
  emailFrom: getEnvVar('EMAIL_FROM'),
  emailTo: getEnvVar('EMAIL_TO'),
};