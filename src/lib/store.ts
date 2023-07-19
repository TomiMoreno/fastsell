import { create } from "zustand";
import { type Product } from "./schemas/product";

interface CartState {
  items: Map<string, { product: Product; amount: number }>;
  addToCart: (product: Product, price: number, amount?: number) => void;
  removeFromCart: (product: Product, price: number, amount?: number) => void;
  changeAmount: (product: Product, price: number, amount: number) => void;
  total: number;
  buy: () => void;
  reset: () => void;
}

interface ProductsState {
  productsAvailable: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  editProduct: (product: Product) => void;
}

export const useCart = create<CartState>()((set) => ({
  items: new Map(),
  total: 0,
  addToCart: (product, price, amount = 1) =>
    set((state) => {
      const currentMap = new Map(state.items);
      const currentAmount = currentMap.get(product.id)?.amount ?? 0;
      currentMap.set(product.id, {
        product,
        amount: currentAmount + amount,
      });
      return {
        items: currentMap,
        total: state.total + price * amount,
      };
    }),
  changeAmount: (product, price, amount) =>
    set((state) => {
      const currentMap = new Map(state.items);
      const currentAmount = currentMap.get(product.id)?.amount ?? 0;
      if (amount <= 0) currentMap.delete(product.id);
      else
        currentMap.set(product.id, {
          product,
          amount,
        });
      const differenceInAmount = amount - currentAmount;
      return {
        items: currentMap,
        total: state.total + price * differenceInAmount,
      };
    }),
  removeFromCart: (product, price, amount = 1) =>
    set((state) => {
      const currentMap = new Map(state.items);
      const currentAmount = currentMap.get(product.id)?.amount ?? 0;
      if (currentAmount === 0) return state;
      if (currentAmount <= amount) currentMap.delete(product.id);
      else
        currentMap.set(product.id, { product, amount: currentAmount - amount });
      return {
        items: currentMap,
        total: Math.max(0, state.total - price * amount),
      };
    }),
  buy: () => set(() => ({ items: new Map() })),
  reset: () => set(() => ({ items: new Map(), total: 0 })),
}));

export const useProducts = create<ProductsState>()((set) => ({
  productsAvailable: [],
  addProduct: (product) =>
    set((state) => ({
      productsAvailable: [...state.productsAvailable, product],
    })),
  removeProduct: (product) =>
    set((state) => ({
      productsAvailable: state.productsAvailable.filter(
        (p) => p.id !== product.id
      ),
    })),
  editProduct: (product) =>
    set((state) => ({
      productsAvailable: state.productsAvailable.map((p) =>
        p.id === product.id ? product : p
      ),
    })),
}));
