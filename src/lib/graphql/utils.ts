import "server-only";
import DOMPurify from "isomorphic-dompurify";
import { parsePrice } from "./client";
import { ProductNode, VariationCard } from "./types";

export const sanitizeHtml = (html?: string | null): string | undefined => {
  if (!html) return html ?? undefined;
  return DOMPurify.sanitize(html);
};

const REGION_ALIASES: Record<string, string[]> = {
  eu: ["eu", "eu-global", "اروپا", "europe"],
  us: ["us", "امریکا", "آمریکا", "america", "usa"],
  tr: ["tr", "ترکیه", "turkey"],
};

function normalizeRegionToken(token?: string | null): string {
  if (!token) return "";
  const lower = token.trim().toLowerCase();
  for (const [canon, aliases] of Object.entries(REGION_ALIASES)) {
    if (aliases.some((alias) => lower === alias || lower.includes(alias))) return canon;
  }
  return lower;
}

export function regionsMatch(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return normalizeRegionToken(a) === normalizeRegionToken(b);
}

export const formatProducts = (
  products: ProductNode[],
  archiveMode: boolean = false,
  activeRegion: string = "eu"
): ProductNode[] => {
  const formattedProducts: ProductNode[] = [];

  products.forEach((product) => {
    const rawVariations = product.variationCards || [];

    const parsedVariationCards = rawVariations.map((v: any) => {
      const pGift = (v.giftPriceToman === "disabled" || !v.giftPriceToman
        ? "disabled"
        : parsePrice(v.giftPriceToman) ?? "disabled") as number | "disabled";

      const pGiftReg = (v.giftRegularPriceToman === "disabled" || !v.giftRegularPriceToman
        ? "disabled"
        : parsePrice(v.giftRegularPriceToman) ?? "disabled") as number | "disabled";

      const pCode = (v.codePriceToman === "disabled" || !v.codePriceToman
        ? "disabled"
        : parsePrice(v.codePriceToman) ?? "disabled") as number | "disabled";

      const pCodeReg = (v.codeRegularPriceToman === "disabled" || !v.codeRegularPriceToman
        ? "disabled"
        : parsePrice(v.codeRegularPriceToman) ?? "disabled") as number | "disabled";

      return {
        ...v,
        parsedPrice: parsePrice(v.price),
        parsedRegularPrice: parsePrice(v.regularPrice),
        parsedGiftPrice: pGift,
        parsedGiftRegularPrice: pGiftReg,
        parsedCodePrice: pCode,
        parsedCodeRegularPrice: pCodeReg,
      };
    });

    let finalPrice: number | null = null;
    let finalRegularPrice: number | null = null;
    let isAvailableInRegion = true;

    if (parsedVariationCards.length > 0) {
      const hasRegionAttr = parsedVariationCards.some((v) => !!v.regionSlug);
      const regionVars = parsedVariationCards.filter((v) => regionsMatch(v.regionSlug, activeRegion));
      const targetVars = regionVars.length > 0 ? regionVars : parsedVariationCards;
      const validPrices = targetVars.filter((v) => typeof v.parsedPrice === "number" && v.parsedPrice > 0);

      if (validPrices.length > 0) {
        const lowestVar = validPrices.reduce((min, p) => (p.parsedPrice! < min.parsedPrice! ? p : min), validPrices[0]);
        finalPrice = lowestVar.parsedPrice;
        finalRegularPrice = lowestVar.parsedRegularPrice;
      } else {
        finalPrice = targetVars[0]?.parsedPrice ?? null;
        finalRegularPrice = targetVars[0]?.parsedRegularPrice ?? null;
      }

      const hasGiftOrCode = targetVars.some(
        (v) => typeof v.parsedGiftPrice === "number" || typeof v.parsedCodePrice === "number"
      );

      isAvailableInRegion = hasRegionAttr
        ? regionVars.length > 0 && (validPrices.length > 0 || hasGiftOrCode)
        : validPrices.length > 0 || hasGiftOrCode || finalPrice != null;
    } else {
      finalPrice = parsePrice(product.price);
      finalRegularPrice = parsePrice(product.regularPrice);
      isAvailableInRegion = finalPrice != null && finalPrice > 0;
    }

    formattedProducts.push({
      ...product,
      shortDescription: sanitizeHtml(product.shortDescription),
      description: sanitizeHtml(product.description),
      parsedPrice: finalPrice,
      parsedRegularPrice: finalRegularPrice,
      variationCards: parsedVariationCards,
      isVariation: parsedVariationCards.length > 0,
      isAvailableInRegion,
    });
  });

  return formattedProducts;
};