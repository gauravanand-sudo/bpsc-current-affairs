export const PROGRAM_PRICING = {
  "upsc-2027": {
    regularPrice: "₹2,00,000",
    currentPrice: "₹1,60,000",
    discount: "20% OFF",
    saving: "Save ₹40,000",
  },
  "bpsc-73": {
    regularPrice: "₹1,20,000",
    currentPrice: "₹87,000",
    discount: "27.5% OFF",
    saving: "Save ₹33,000",
  },
} as const;

export type ProgramPricingSlug = keyof typeof PROGRAM_PRICING;

export function getProgramPricing(slug: string) {
  return PROGRAM_PRICING[slug as ProgramPricingSlug] ?? null;
}
