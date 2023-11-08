import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createStripeProduct(
  name: string
): Promise<Stripe.Response<Stripe.Product>> {
  return stripe.products.create({
    name: name,
  });
}

export async function createStripePrice(
  product_id: string,
  price_in_cents: number
): Promise<Stripe.Response<Stripe.Price>> {
  return await stripe.prices.create({
    unit_amount: price_in_cents,
    currency: 'usd',
    product: product_id,
  });
}
