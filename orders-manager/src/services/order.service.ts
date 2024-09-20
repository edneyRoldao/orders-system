import { OrderRequest } from '../dto/order-request.dto'
import { OrderResponseDTO } from '../dto/order-response.dto'
import { Paged } from '../dto/paged'
import { Order } from '../models/order'

export interface OrderService {

    create(orderRequest: OrderRequest): Promise<OrderResponseDTO>
    getByCode(code: string): Promise<Order>
    getAll(pageSize: number, pageNumber: number, orderStatus: string, initDate: string, endDate: string): Promise<Paged<Order>>

}
