import {CreateOrderRequest, Order, OrderResponse, OrderStatus, UpdateOrderRequest} from "@/types/exchange/order";
import { api_exchange } from "@/api/axios.ts";


export const getAllOrders = async (
    status: OrderStatus | null = null,
    page: number,
    size: number,
): Promise<OrderResponse> => {
    try {
        const response = await api_exchange.get('/orders', {
            params: {
                status,
                page,
                size,
            },
        });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error(`❌ Error fetching orders!`, error);
        throw error;
    }
}


export const editOrder = async (
    id: string,
    data: UpdateOrderRequest,
): Promise<Order> => {
    try {
        const response = await api_exchange.put(`/orders/${id}`, data);

        return response.data;
    }
    catch (error) {
        console.error(`❌ Error fetching orders!`, error);
        throw error;
    }
}



export const createOrder = async (
    data: CreateOrderRequest,
): Promise<Order> => {
    try {
        const response = await api_exchange.post('/orders', data)

        return response.data;
    }
    catch (error) {
        console.error(`❌ Error creating a new order!`, error);
        throw error;
    }
}