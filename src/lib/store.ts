import { create } from "zustand";

interface Product {
  id: string;
  price: number;
}

interface CartState {
  items: Map<string, number>;
  addToCart: (product: Product, amount?: number) => void;
  removeFromCart: (product: Product, amount?: number) => void;
}

interface ProductsState {
  productsAvailable: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  editProduct: (product: Product) => void;
}

export const useCart = create<CartState>()((set) => ({
  items: new Map(),
  addToCart: (product, amount = 1) =>
    set((state) => ({
      items: new Map(state.items).set(
        product.id,
        state.items.get(product.id) ?? 0 + amount
      ),
    })),
  removeFromCart: (product, amount = 1) =>
    set((state) => {
      const currentMap = new Map(state.items);
      const currentAmount = currentMap.get(product.id) ?? 0;
      if (currentAmount <= amount) currentMap.delete(product.id);
      else currentMap.set(product.id, currentAmount - amount);
      return {
        items: currentMap,
      };
    }),
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
