export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    addresses: Address[];
    isAdmin?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    id: string;
    label: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    isDefault: boolean;
    lat: number;
    lng: number;
}

export interface Category {
    slug: string;
    name: string;
    image: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    unit: string;
    stock: number;
    isOrganic: boolean;
    rating: number;
    reviewCount: number;
    discount: number;
    createdAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface OrderItem {
    product: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    unit: string;
}

export interface DeliveryPartner {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    vehicleType: "bike" | "scooter" | "car";
    isActive: boolean;
    createdAt: string;
}

// export interface Order {
//     id: string;
//     user: string | { id: string; name: string; email: string; phone?: string };
//     items: OrderItem[];
//     shippingAddress: Omit<Address, "id" | "isDefault">;
//     paymentMethod: string;
//     subtotal: number;
//     deliveryFee: number;
//     tax: number;
//     total: number;
//     status: string;
//     statusHistory: { status: string; timestamp: string; note: string }[];
//     deliveryPartner: DeliveryPartner | null;
//     deliveryOtp: string;
//     isPaid: boolean;
//     createdAt: string;
// }
export interface Order {
  id: string;

  user:
    | string
    | {
        id: string;
        name: string;
        email: string;
        phone?: string;
      };

  items: OrderItem[];

  shippingAddress: {
    label: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };

  paymentMethod: string;

  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;

  status:
    | "Placed"
    | "Assigned"
    | "Packed"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";

  statusHistory: {
    status: string;
    timestamp: string;
    note: string;
    id?: string;
  }[];

  deliveryPartner:
    | {
        id: string;
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
        vehicleType?: string;
        isActive?: boolean;
        createdAt?: string;
      }
    | null;

  deliveryOtp: string;

  isPaid: boolean;

  createdAt: string;

  updatedAt?: string;

  __v?: number;

  liveLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
}
