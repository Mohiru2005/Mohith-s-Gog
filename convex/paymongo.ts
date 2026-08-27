import { action } from "./_generated/server";
import { v } from "convex/values";

// PayMongo API configuration
const PAYMONGO_API_BASE = "https://api.paymongo.com/v1";

// Helper function to require environment variables with graceful fallback
function getEnv(name: string, fallback: string = ""): string {
  return process.env[name] || fallback;
}

const PAYMONGO_SECRET_KEY = getEnv("PAYMONGO_SECRET_KEY", "dummy_secret_key");
const PAYMONGO_WEBHOOK_SECRET = getEnv("PAYMONGO_WEBHOOK_SECRET", "dummy_webhook_secret");

// Helper function to base64 encode
function base64Encode(str: string): string {
  if (typeof btoa !== "undefined") {
    return btoa(str);
  }
  return Buffer.from(str).toString("base64");
}

// Helper function to make authenticated PayMongo API requests
async function paymongoRequest(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body?: any
): Promise<any> {
  const url = `${PAYMONGO_API_BASE}${endpoint}`;
  const authString = base64Encode(PAYMONGO_SECRET_KEY + ":");
  const headers: Record<string, string> = {
    "Authorization": `Basic ${authString}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && (method === "POST" || method === "PATCH")) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayMongo API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

function sanitizeMetadata(metadata?: Record<string, any>): Record<string, string> {
  if (!metadata) return {};
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    sanitized[key] = String(value);
  }
  return sanitized;
}

function getAllowedPaymentMethods(): string[] {
  const isProduction = process.env.ENV === "production";
  if (isProduction) {
    return ["qrph"];
  }
  return ["card", "paymaya", "gcash", "qrph"];
}

export async function createPaymentIntent(
  amount: number,
  description: string,
  metadata?: Record<string, any>,
  paymentMethodAllowed?: string[]
): Promise<{ id: string; client_secret: string; status: string }> {
  const allowedMethods = paymentMethodAllowed ?? getAllowedPaymentMethods();
  const response = await paymongoRequest("/payment_intents", "POST", {
    data: {
      attributes: {
        amount,
        currency: "PHP",
        payment_method_allowed: allowedMethods,
        description,
        metadata: sanitizeMetadata(metadata),
      },
    },
  });

  return {
    id: response.data.id,
    client_secret: response.data.attributes.client_key,
    status: response.data.attributes.status,
  };
}

export async function getPaymentIntent(paymentIntentId: string): Promise<any> {
  const response = await paymongoRequest(`/payment_intents/${paymentIntentId}`);
  return response.data;
}

export async function attachPaymentMethod(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<any> {
  const response = await paymongoRequest(
    `/payment_intents/${paymentIntentId}/attach`,
    "POST",
    {
      data: {
        attributes: {
          payment_method: paymentMethodId,
          return_url: getEnv("PAYMONGO_RETURN_URL", "https://localhost:3000"),
        },
      },
    }
  );
  return response.data;
}

export async function createCheckoutSession(
  amount: number,
  description: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, any>,
  customerName?: string,
  customerEmail?: string
): Promise<{ id: string; checkout_url: string }> {
  const attributes: any = {
    line_items: [
      {
        currency: "PHP",
        amount,
        name: description,
        quantity: 1,
      },
    ],
    payment_method_types: getAllowedPaymentMethods(),
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: sanitizeMetadata(metadata),
  };

  if (customerName && customerEmail) {
    attributes.billing = {
      name: customerName,
      email: customerEmail,
    };
  }

  const response = await paymongoRequest("/checkout_sessions", "POST", {
    data: {
      attributes,
    },
  });

  return {
    id: response.data.id,
    checkout_url: response.data.attributes.checkout_url,
  };
}

export function parsePayMongoSignature(header: string): {
  timestamp: string;
  testSignature: string;
  liveSignature: string;
} | null {
  if (!header) return null;
  
  const parts: Record<string, string> = {};
  const pairs = header.split(",");
  
  for (const pair of pairs) {
    const [key, value] = pair.split("=", 2);
    if (key && value) {
      parts[key.trim()] = value.trim();
    }
  }
  
  if (!parts.t || (!parts.te && !parts.li)) {
    return null;
  }
  
  return {
    timestamp: parts.t,
    testSignature: parts.te || "",
    liveSignature: parts.li || "",
  };
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  timestamp: string,
  _isLiveMode: boolean = false
): Promise<boolean> {
  if (!PAYMONGO_WEBHOOK_SECRET) {
    console.warn("PayMongo webhook secret not configured");
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(PAYMONGO_WEBHOOK_SECRET);
  const messageData = encoder.encode(signedPayload);
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  
  const maxLen = Math.max(signature.length, expectedSignature.length);
  let result = signature.length ^ expectedSignature.length;
  for (let i = 0; i < maxLen; i++) {
    const a = i < signature.length ? signature.charCodeAt(i) : 0;
    const b = i < expectedSignature.length ? expectedSignature.charCodeAt(i) : 0;
    result |= a ^ b;
  }
  return result === 0;
}

export function parseWebhookEvent(event: any): {
  type: string;
  data: any;
  id: string;
} {
  return {
    type: event.type,
    data: event.data,
    id: event.id,
  };
}

export const createSubscriptionPaymentIntent = action({
  args: {
    amount: v.number(),
    description: v.string(),
    metadata: v.optional(v.any()),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      paymentIntentId: v.string(),
      clientSecret: v.string(),
      status: v.string(),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    try {
      const paymentIntent = await createPaymentIntent(
        args.amount,
        args.description,
        args.metadata
      );
      return {
        success: true as const,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const createDonationPaymentIntent = action({
  args: {
    amount: v.number(),
    description: v.string(),
    metadata: v.optional(v.any()),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      paymentIntentId: v.string(),
      clientSecret: v.string(),
      status: v.string(),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    try {
      const paymentIntent = await createPaymentIntent(
        args.amount,
        args.description,
        args.metadata
      );
      return {
        success: true as const,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error("Error creating donation payment intent:", error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const createDonationCheckout = action({
  args: {
    amount: v.number(),
    description: v.string(),
    successUrl: v.string(),
    cancelUrl: v.string(),
    metadata: v.optional(v.any()),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      checkoutUrl: v.string(),
      sessionId: v.string(),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    try {
      const checkoutSession = await createCheckoutSession(
        args.amount,
        args.description,
        args.successUrl,
        args.cancelUrl,
        args.metadata,
        args.customerName,
        args.customerEmail
      );
      return {
        success: true as const,
        checkoutUrl: checkoutSession.checkout_url,
        sessionId: checkoutSession.id,
      };
    } catch (error) {
      console.error("Error creating donation checkout:", error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const createSubscriptionCheckout = action({
  args: {
    amount: v.number(),
    description: v.string(),
    successUrl: v.string(),
    cancelUrl: v.string(),
    metadata: v.optional(v.any()),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      checkoutUrl: v.string(),
      sessionId: v.string(),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    try {
      const checkoutSession = await createCheckoutSession(
        args.amount,
        args.description,
        args.successUrl,
        args.cancelUrl,
        args.metadata,
        args.customerName,
        args.customerEmail
      );
      return {
        success: true as const,
        checkoutUrl: checkoutSession.checkout_url,
        sessionId: checkoutSession.id,
      };
    } catch (error) {
      console.error("Error creating subscription checkout:", error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const verifyPaymentIntent = action({
  args: {
    paymentIntentId: v.string(),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      status: v.string(),
      amount: v.number(),
      currency: v.string(),
      metadata: v.optional(v.any()),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    try {
      const paymentIntent = await getPaymentIntent(args.paymentIntentId);
      return {
        success: true as const,
        status: paymentIntent.attributes.status,
        amount: paymentIntent.attributes.amount,
        currency: paymentIntent.attributes.currency,
        metadata: paymentIntent.attributes.metadata,
      };
    } catch (error) {
      console.error("Error verifying payment intent:", error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
