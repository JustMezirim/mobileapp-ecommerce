import { create } from 'zustand';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalPrice: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],
  
  addToCart: (product, quantity) => {
    set((state) => {
      const existing = state.cartItems.find(item => item._id === product._id);
      if (existing) {
        return {
          cartItems: state.cartItems.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        cartItems: [...state.cartItems, {
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity,
          images: product.images,
        }],
      };
    });
  },
  
  removeFromCart: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter(item => item._id !== id),
    }));
  },
  
  updateQuantity: (id, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(id);
      return;
    }
    set((state) => ({
      cartItems: state.cartItems.map(item =>
        item._id === id ? { ...item, quantity } : item
      ),
    }));
  },
  
  getTotalPrice: () => {
    return get().cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  clearCart: () => {
    set({ cartItems: [] });
  },
}));
