"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getClientCookie, setClientCookie, removeClientCookie } from "@/lib/cookies";

const CART_COOKIE = "a2b_cart";
const CART_COOKIE_DAYS = 30;

export interface CartItem {
  id: string;
  databaseId: number;
  productId?: number;
  variationId?: number;
  name: string;
  price: number;
  regularPrice?: number;
  deliveryMethod: "gift" | "code" | "direct";
  region?: string;
  variationName?: string;
  customFields?: {
    battleTag?: string;
    email?: string;
    password?: string;
  };
  quantity: number;
}

export type NewCartItem = Omit<CartItem, "id" | "quantity">;

function buildIdentityKey(item: NewCartItem): string {
  const cf = item.customFields || {};
  return [
    item.databaseId,
    item.deliveryMethod,
    item.region ?? "",
    item.variationName ?? "",
    cf.email ?? "",
    cf.password ?? "",
    cf.battleTag ?? "",
  ].join("::");
}

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i.id === "string" &&
    typeof i.databaseId === "number" &&
    typeof i.name === "string" &&
    typeof i.price === "number" &&
    typeof i.quantity === "number" &&
    i.quantity > 0 &&
    ["gift", "code", "direct"].includes(i.deliveryMethod as string)
  );
}

function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: NewCartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setCart(parseStoredCart(getClientCookie(CART_COOKIE)));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => {
      try {
        setClientCookie(CART_COOKIE, JSON.stringify(cart), { days: CART_COOKIE_DAYS });
      } catch {
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [cart, isMounted]);

  const addToCart = useCallback((item: NewCartItem) => {
    setCart((prev) => {
      const key = buildIdentityKey(item);
      const existingIndex = prev.findIndex((p) => buildIdentityKey(p) === key);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      return [...prev, { ...item, id: key, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.id !== id);
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    removeClientCookie(CART_COOKIE);
  }, []);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};