import { Product } from "./product";

export interface Order {
    id?: string;
    point: string;
    state: 'open' | 'closed';
    order: OrderItem []
}

export interface OrderItem{
    item: Product,
    quantity: number 
}