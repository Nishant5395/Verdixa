import Stripe from "stripe";
import { HttpError } from "../utils/errors.js";

let client: Stripe | null = null;

/** Lazily creates the Stripe client so the server can boot even if Stripe isn't configured. */
export const getStripe = (): Stripe => {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new HttpError(500, "Card payments are not configured");
    client = new Stripe(key);
  }
  return client;
};
