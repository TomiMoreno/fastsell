import { create } from "zustand";
import { type Product } from "./schemas/product";

interface CartState {
  items: Map<string, { product: Product; amount: number }>;
  addToCart: (product: Product, amount?: number) => void;
  removeFromCart: (product: Product, amount?: number) => void;
  changeAmount: (product: Product, amount: number) => void;
  buy: () => void;
  reset: () => void;
  computed: {
    total: number;
  }
}

interface ProductsState {
  productsAvailable: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  editProduct: (product: Product) => void;
}

const calculateTotal = (items: CartState["items"]) =>
  [...items.values()].reduce((acc, { product, amount }) => acc + product.price * amount, 0);

export const useCart = create<CartState>()((set, get) => ({
  items: new Map(),
  changeAmount: (product, amount) =>
    set((state) => {
      const currentMap = new Map(state.items);
      if (amount <= 0) currentMap.delete(product.id);
      else
        currentMap.set(product.id, {
          product,
          amount,
        });
      return {
        items: currentMap,
      };
    }),
  addToCart: (product, amount = 1) =>
    set((state) => {
      const currentMap = new Map(state.items);
      const currentAmount = currentMap.get(product.id)?.amount ?? 0;
      currentMap.set(product.id, {
        product,
        amount: currentAmount + amount,
      });
      return {
        items: currentMap,
      };
    }),
  removeFromCart: (product, amount = 1) =>
    set((state) => {
      const currentMap = new Map(state.items);
      const currentAmount = currentMap.get(product.id)?.amount ?? 0;
      if (currentAmount === 0) return state;
      if (currentAmount <= amount) currentMap.delete(product.id);
      else
        currentMap.set(product.id, { product, amount: currentAmount - amount });
      return {
        items: currentMap,
      };
    }),
  buy: () => set(() => ({ items: new Map() })),
  reset: () => set(() => ({ items: new Map()})),
  computed: {
    get total() {
      return calculateTotal(get().items);
    }
  }
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
