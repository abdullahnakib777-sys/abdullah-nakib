import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client server-side lazily
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface GroundedProductContext {
  id: string;
  name: string;
  nameBn?: string;
  category: string;
  resellerPrice: number;
  suggestedSellingPrice: number;
  potentialProfit: number;
  features: string[];
  specifications: Record<string, string>;
  stock: number;
  returnRatePercent: number;
}

export class AIService {
  /**
   * ResellAI chat assistant with server-side platform grounding
   */
  static async chatWithResellAI(params: {
    message: string;
    history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
    products: GroundedProductContext[];
    userRole?: string;
    language?: 'en' | 'bn';
  }): Promise<{ reply: string; source: 'gemini' | 'fallback' }> {
    const ai = getGeminiClient();

    // Prepare platform context for grounding
    const productCatalogSummary = params.products
      .slice(0, 15)
      .map(
        (p) =>
          `- ${p.name} (${p.category}): Reseller Wholesale Price ৳${p.resellerPrice}, Suggested Selling Price ৳${p.suggestedSellingPrice}, Profit Margin ৳${p.potentialProfit}. Features: ${p.features.join(', ')}. Stock: ${p.stock}`
      )
      .join('\n');

    const systemPrompt = `You are "ResellAI", the smart AI assistant for Shadhin Reseller — Bangladesh's premier modern reseller commerce platform.
Your job is to help resellers and customers with:
1. Product questions, specifications, and inventory availability in Bangladesh.
2. Explaining wholesale reseller prices, suggested retail prices, and profit margins.
3. Order fulfillment process: We handle quality checks, packaging, and nationwide courier delivery (Steadfast, Pathao, RedX) with Cash on Delivery (COD).
4. Explaining wallet settlements (profits become available upon successful delivery), withdrawals (bKash, Nagad, Bank), and gamification (XP, Levels, Badges).
5. Tips for selling on Facebook Page, Facebook Marketplace, WhatsApp, and TikTok in Bangladesh.

Current Available Platform Catalog:
${productCatalogSummary}

Platform Rules:
- Delivery Fee: Dhaka ৳60 (1-2 days), Outside Dhaka ৳120 (2-4 days).
- Payment: Cash on Delivery (COD), bKash, Nagad, Bank transfer.
- Reseller Earnings: Profit is credited as Pending upon order creation, and becomes Available upon successful delivery.
- Minimum Withdrawal: ৳500 via bKash, Nagad, or Bank.
- If asked unrelated questions (like writing code, general trivia, homework, or external politics), politely refuse: "I'm here specifically to help with Shadhin Reseller products, pricing, orders, and sales tips in Bangladesh! 🙂"
- Keep responses friendly, energetic, transparent, practical, and culturally tuned for Bangladesh. Support natural Bangla or English as requested by the user.`;

    if (!ai) {
      // High-quality local heuristic fallback if API key is not configured
      const q = params.message.toLowerCase();
      let reply = '';
      if (q.includes('profit') || q.includes('লাভ') || q.includes('earn')) {
        reply = `On Shadhin Reseller, your profit is the difference between your customer selling price and the wholesale reseller price! For example, if a product reseller price is ৳320 and you sell it for ৳499, your profit is ৳179. Profits become Available in your wallet as soon as the order is delivered via courier.`;
      } else if (q.includes('delivery') || q.includes('courier') || q.includes('ডেলিভারি') || q.includes('পাঠাও')) {
        reply = `We deliver nationwide across Bangladesh using Steadfast, Pathao, and RedX couriers. Delivery fee is ৳60 inside Dhaka (1-2 days) and ৳120 outside Dhaka (2-4 days) with full Cash on Delivery (COD) support.`;
      } else if (q.includes('withdraw') || q.includes('টাকা') || q.includes('bkash') || q.includes('বিকাশ')) {
        reply = `You can withdraw your available profits anytime via bKash, Nagad, or Bank transfer once your balance reaches the minimum threshold of ৳500. Withdrawals are processed quickly within 12-24 hours!`;
      } else {
        reply = `Hello! I am ResellAI 🚀 I can help you find high-profit trending products, write high-converting Facebook/WhatsApp sales pitches, explain shipping & COD fulfillment, or guide your wallet withdrawals. How can I help you make your next sale today?`;
      }
      return { reply, source: 'fallback' };
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: params.message,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      return {
        reply: response.text || "I'm here to help you grow your reseller business with Shadhin Reseller!",
        source: 'gemini',
      };
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local assistant:', err?.message || err);
      return {
        reply: `Shadhin Reseller empowers you to sell high-demand products across Bangladesh without holding inventory. You discover products, pick your profit margin, share on Facebook/WhatsApp, and we handle complete fulfillment!`,
        source: 'fallback',
      };
    }
  }

  /**
   * Generates tailored selling kits: Facebook caption, WhatsApp pitch, objections handler
   */
  static async generateSellingKit(product: GroundedProductContext): Promise<{
    facebookCaption: string;
    whatsappPitch: string;
    bulletBenefits: string[];
    objectionHandling: { objection: string; response: string }[];
    marketingAngles: string[];
  }> {
    const ai = getGeminiClient();

    const defaultFallback = {
      facebookCaption: `🔥 প্রিমিয়াম কোয়ালিটির ${product.nameBn || product.name}! \n\n✨ বিশেষ সুবিধাসমূহ:\n${product.features.map((f) => `• ${f}`).join('\n')}\n\n💰 অফার মূল্য: মাত্র ৳${product.suggestedSellingPrice}/- \n🚚 সারাদেশে ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা পরিশোধ করুন)।\n\n👉 অর্ডার করতে এখনই ইনবক্স করুন অথবা হোয়াটসঅ্যাপ করুন!`,
      whatsappPitch: `আসসালামু আলাইকুম! 👋 আপনি কি প্রিমিয়াম ${product.nameBn || product.name} খুঁজছিলেন? আমাদের কাছে সরাসরি ইমপোর্টার প্রাইসে পাচ্ছেন মাত্র ৳${product.suggestedSellingPrice} টাকায়। ডেলিভারিম্যান সামনে রেখে চেক করে নেওয়ার সুযোগ আছে। আজকেই অর্ডার করলে পাচ্ছেন ফ্রি গিফট/দ্রুত ডেলিভারি!`,
      bulletBenefits: [
        `১০০% অরিজিনাল ও প্রি-চেকড কোয়ালিটি গ্যারান্টি`,
        `সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা`,
        `সহজ ৭ দিনের রিপ্লেসমেন্ট সুবিধা`,
        `সেরা বাজেটে সর্বোচ্চ কার্যকারিতা`,
      ],
      objectionHandling: [
        {
          objection: 'দাম কি একটু বেশি?',
          response:
            'আমাদের এই প্রোডাক্টটি গ্রেড-এ অরিজিনাল কোয়ালিটি এবং প্রত্যেকটি আইটেম ডেলিভারির আগে টেস্ট করা হয়। বাজারে কমদামের ক্লোনগুলোর চেয়ে এর স্থায়িত্ব অনেক বেশি।',
        },
        {
          objection: 'পণ্য পছন্দ না হলে কি রিটার্ন করা যাবে?',
          response:
            'অবশ্যই! আমাদের ডেলিভারি ম্যানের সামনে চেক করার অপশন রয়েছে এবং ডিফেক্ট থাকলে ইনস্ট্যান্ট রিপ্লেসমেন্ট পলিসি রয়েছে।',
        },
      ],
      marketingAngles: [
        'দৈনন্দিন জীবনের আরাম ও সময় বাঁচানোর সহজ সমাধান',
        'প্রিমিয়াম লাইফস্টাইল ও গিফট আইটেম হিসেবে সেরা পছন্দ',
        'সীমিত স্টক স্পেশাল প্রাইস ডিসকাউন্ট ক্যাম্পেইন',
      ],
    };

    if (!ai) {
      return defaultFallback;
    }

    try {
      const prompt = `You are a top e-commerce copywriter in Bangladesh. Generate high-converting sales assets for this product:
Product Name: ${product.name}
Category: ${product.category}
Suggested Retail Price: ৳${product.suggestedSellingPrice}
Key Features: ${product.features.join(', ')}
Specifications: ${JSON.stringify(product.specifications)}

Respond strictly in JSON format with this exact structure:
{
  "facebookCaption": "An energetic Bengali/English Facebook caption with emojis, hook, features, price in ৳, COD notice, and clear CTA",
  "whatsappPitch": "A short polite direct WhatsApp message to close the deal",
  "bulletBenefits": ["Benefit 1 in Bangla", "Benefit 2 in Bangla", "Benefit 3 in Bangla", "Benefit 4 in Bangla"],
  "objectionHandling": [
    {"objection": "Common customer hesitation in Bangla", "response": "Persuasive and honest response in Bangla"},
    {"objection": "Delivery/trust hesitation in Bangla", "response": "Reassuring COD and return policy response in Bangla"}
  ],
  "marketingAngles": ["Angle 1", "Angle 2", "Angle 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text?.trim() || '';
      const parsed = JSON.parse(text);
      return {
        facebookCaption: parsed.facebookCaption || defaultFallback.facebookCaption,
        whatsappPitch: parsed.whatsappPitch || defaultFallback.whatsappPitch,
        bulletBenefits: Array.isArray(parsed.bulletBenefits) ? parsed.bulletBenefits : defaultFallback.bulletBenefits,
        objectionHandling: Array.isArray(parsed.objectionHandling) ? parsed.objectionHandling : defaultFallback.objectionHandling,
        marketingAngles: Array.isArray(parsed.marketingAngles) ? parsed.marketingAngles : defaultFallback.marketingAngles,
      };
    } catch (err) {
      console.warn('Gemini Selling Kit generation error, using fallback:', err);
      return defaultFallback;
    }
  }
}
