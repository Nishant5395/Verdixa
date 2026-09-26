import { Request, Response } from "express";
import { z } from "zod";
import type { Content, FunctionDeclaration } from "@google/genai";
import { prisma } from "../config/prisma.js";
import { CHAT_MODEL, getGemini } from "../config/gemini.js";
import { getPricing } from "../config/pricing.js";
import { HttpError } from "../utils/errors.js";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const chatSchema = z.object({
  message: z.string().trim().min(1, "Message can't be empty").max(2000),
  // Prior turns of the conversation, oldest first. Kept short - this is a support
  // chat, not a long-running assistant, and every extra turn costs real tokens.
  history: z.array(messageSchema).max(12).default([]),
});

const currencyLabel: Record<string, string> = { inr: "₹", usd: "$", eur: "€", gbp: "£" };

function buildSystemPrompt(isLoggedIn: boolean) {
  const p = getPricing();
  const currency = currencyLabel[p.currency] || p.currency.toUpperCase() + " ";

  return `You are the friendly customer support assistant for Instacart, an online grocery delivery store. You answer customers' general questions right in the chat widget on the website.

Store facts (answer from these - don't guess numbers):
- Delivery fee: ${currency}${p.deliveryFee}, free above ${currency}${p.freeDeliveryThreshold} order value.
- Tax: ${(p.taxRate * 100).toFixed(0)}% is applied to the order after any discount.
- Payment methods: card (via Stripe) or Cash on Delivery.
- Coupons: entered at checkout in the "Have a coupon?" box; some coupons are first-order-only, have a minimum order value, or a maximum discount cap - the checkout page shows the exact reason if one doesn't apply.
- Order cancellation: customers can cancel their own order from the Orders page or the order tracking page, but only while it's still "Placed", "Confirmed", or "Assigned" to a rider. Once it's "Packed" or later, they can no longer self-cancel and should contact support.
- Order tracking: every order has a live tracking page reachable from "My Orders", showing status, and once a rider is on the way, a live map and a delivery OTP the rider needs to complete delivery.
- Refunds for paid card orders on a cancelled order are handled by the team manually, not instantly.

${
  isLoggedIn
    ? "This customer is logged in. If they ask about a specific order (e.g. \"where is my order\", \"order #ABCD1234\"), use the get_order_status tool - don't guess. If they don't give an order number and have more than one recent order, ask which one, or call the tool with no orderId to see their most recent order."
    : "This visitor is NOT logged in, so you cannot look up any order for them. If they ask about an order, tell them to log in first, then ask again."
}

How to respond:
- Be warm, brief, and to the point - most answers should be 1-4 sentences. This is a chat bubble, not an essay.
- If something needs a human (a refund dispute, a damaged item, a complaint, anything outside what's listed above), say clearly that you're an automated assistant and they should contact the store's support team, and don't invent a policy you're not sure of.
- Never invent order details, tracking numbers, or promises you can't back up.
- You can only discuss Instacart and grocery-shopping related questions. For anything unrelated, politely redirect back to how you can help with their Instacart shopping or order.`;
}

const ORDER_TOOL: FunctionDeclaration = {
  name: "get_order_status",
  description:
    "Looks up the status, items, and total of one of the current customer's own orders. Only works for the logged-in customer's own orders.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      orderId: {
        type: "string",
        description:
          'The short order code shown in the app, e.g. "A1B2C3D4" (the last 8 characters of the order id, as shown after "Order #"). Omit this to get the customer\'s most recent order instead.',
      },
    },
  },
};

async function lookupOrder(userId: string, orderIdFragment?: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  const order = orderIdFragment
    ? orders.find((o) => o.id.toLowerCase().endsWith(orderIdFragment.trim().toLowerCase()))
    : orders[0];

  if (!order) {
    return { found: false, message: "No matching order was found for this customer." };
  }

  const items = Array.isArray(order.items) ? (order.items as any[]) : [];
  return {
    found: true,
    orderCode: order.id.slice(-8).toUpperCase(),
    status: order.status,
    placedAt: order.createdAt,
    total: order.total,
    paymentMethod: order.paymentMethod,
    isPaid: order.isPaid,
    items: items.map((i) => ({ name: i.name, quantity: i.quantity })),
  };
}

// Gemini uses "model" where most chat APIs say "assistant".
const toGeminiRole = (role: "user" | "assistant"): "user" | "model" => (role === "user" ? "user" : "model");

//POST /api/chat
export const sendMessage = async (req: Request, res: Response) => {
  const { message, history } = chatSchema.parse(req.body);
  const ai = getGemini(); // throws a clear 503 if GEMINI_API_KEY isn't set
  const isLoggedIn = Boolean(req.user);

  const contents: Content[] = [
    ...history.map((h): Content => ({ role: toGeminiRole(h.role), parts: [{ text: h.content }] })),
    { role: "user", parts: [{ text: message }] },
  ];

  const request = {
    model: CHAT_MODEL,
    contents,
    config: {
      systemInstruction: buildSystemPrompt(isLoggedIn),
      maxOutputTokens: 500,
      ...(isLoggedIn ? { tools: [{ functionDeclarations: [ORDER_TOOL] }] } : {}),
    },
  };

  let response: Awaited<ReturnType<typeof ai.models.generateContent>>;
  try {
    response = await ai.models.generateContent(request);
  } catch (error) {
    console.error("Gemini chat request failed:", error);
    throw new HttpError(502, "The support chat is temporarily unavailable. Please try again shortly.");
  }

  // One round of tool use is enough for a support FAQ bot (look up an order, then answer).
  const calls = response.functionCalls;
  if (calls && calls.length > 0) {
    const call = calls[0];

    if (call.name === "get_order_status") {
      const result = req.user
        ? await lookupOrder(req.user.id, (call.args as { orderId?: string })?.orderId)
        : { found: false, message: "Customer is not logged in." };

      try {
        response = await ai.models.generateContent({
          ...request,
          contents: [
            ...contents,
            { role: "model", parts: [{ functionCall: call }] },
            {
              role: "user",
              parts: [{ functionResponse: { name: call.name, response: result } }],
            },
          ],
        });
      } catch (error) {
        console.error("Gemini chat follow-up request failed:", error);
        throw new HttpError(502, "The support chat is temporarily unavailable. Please try again shortly.");
      }
    }
  }

  const reply = (response.text || "").trim();
  res.json({ reply: reply || "Sorry, I couldn't come up with a reply to that - could you try rephrasing?" });
};
