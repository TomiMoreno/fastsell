import { create } from "zustand";

interface Product {
  id: string;
  price: number;
}

interface CartState {
  items: {
    productId: string;
    quantity: number;
  }[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  calculateTotal: () => number;
}

interface ProductsState {
  productsAvailable: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  editProduct: (product: Product) => void;
}

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
