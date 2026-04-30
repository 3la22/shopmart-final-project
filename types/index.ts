export interface User {
  _id: string
  name: string
  email: string
  phone: string
  photo: string
  role: string
  token?: string
}

export interface Product {
  _id: string
  title: string
  slug: string
  description: string
  quantity: number
  price: number
  priceAfterDiscount?: number
  imageCover: string
  images: string[]
  category: Category
  subcategory: Subcategory[]
  brand: Brand
  ratingsAverage: number
  ratingsQuantity: number
  sold: number
}

export interface Category {
  _id: string
  name: string
  slug: string
  image: string
}

export interface Subcategory {
  _id: string
  name: string
  slug: string
  category: string
}

export interface Brand {
  _id: string
  name: string
  slug: string
  image: string
}

export interface CartItem {
  _id: string
  product: Product
  count: number
  price: number
}

export interface Cart {
  _id: string
  cartOwner: string
  products: CartItem[]
  totalCartPrice: number
  totalAfterDiscount?: number
  numOfCartItems: number
}

export interface WishlistItem extends Product {}

export interface Order {
  _id: string
  user: { name: string; email: string; phone: string }
  cartItems: CartItem[]
  shippingAddress: Address
  totalOrderPrice: number
  paymentMethodType: 'cash' | 'card'
  isPaid: boolean
  isDelivered: boolean
  paidAt?: string
  deliveredAt?: string
  createdAt: string
}

export interface Address {
  _id?: string
  alias: string
  details: string
  phone: string
  city: string
  postalCode: string
}

export interface ApiResponse<T> {
  status: string
  message?: string
  data?: T
  token?: string
  results?: number
}

export interface ProductsResponse {
  status: string
  results: number
  metadata: {
    currentPage: number
    numberOfPages: number
    limit: number
    nextPage?: number
    prevPage?: number
  }
  data: Product[]
}
