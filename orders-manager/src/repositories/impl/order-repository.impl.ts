import { Order } from '../../models/order'
import { OrderRepository } from '../order.repository'
import { Repository } from '../repository'
import queries from '../../../files/queries/orders-queries.json'
import { OrderItem } from '../../models/order-item'

export class OrderRepositoryImpl extends Repository implements OrderRepository {

    async create(order: Order): Promise<Order> {
        await this.datasource.query(queries.create, order.code, order.customerId)
        return await this.getByCode(order.code)
    }

    async getByCode(code: string): Promise<Order> {
        const data = await this.datasource.query(queries.getByCodeFull, code)
        const resultSet = data[0] as any[]

        const items: OrderItem[] = this.itemsConverter(resultSet)
        const order: Order = this.ordersConverter(resultSet, items)

        return order    
    }

    private ordersConverter(resultSet: any[], items: OrderItem[]): Order {
        return {
            id: resultSet[0]['order_id'],
            code: resultSet[0]['order_code'],
            customerId: resultSet[0]['customer'],
            created: resultSet[0]['created'],
            status: resultSet[0]['status'],
            statusPayment: resultSet[0]['status_payment'],
            customerDocument: resultSet[0]['document'],
            total: resultSet.reduce((a, c) => a + parseFloat(c['total']), 0),
            items
        }
    }

    private itemsConverter(resultSet: any[]): OrderItem[] {
        return resultSet.map(item => {
            return {
                productId: item['product_id'],
                orderId: item['order_id'],
                quantity: item['quantity'],
                discountPercent: item['discount_percent'],
                total: item['value']
            }
        })
    }

    async createOrderItem(item: OrderItem): Promise<void> {
        await this.datasource.query(queries.createOrderItem, item.productId, item.orderId, item.quantity, item.discountPercent, item.total)
    }

    async createOrderItemBatch(items: OrderItem[]): Promise<void> {
        for (const item of items) {
            await this.createOrderItem(item)
        }
    }

    async getAll(pageSize: number, pageNumber: number, orderStatus: string, initDate: string, endDate: string): Promise<Order[]> {
        const offset = (pageNumber - 1) * pageSize
        const orderStatusF = `%${orderStatus}%`
        const data = await this.datasource.query(queries.getAll, orderStatusF, initDate, endDate, pageSize, offset)
        const resultSet = data[0] as any[]

        const items: OrderItem[] = this.itemsConverter(resultSet)

        // problema: os itens de todos os pedidos estao juntos, precisamos segregar por pedido

        // passo 1 -> extrair os orderIds dos items
        const orderIds = items.map(element => element.orderId)
        // passo 2 -> eliminar os repetidos
        const setOrderIds = new Set(orderIds)

        // passo 3 -> iterar sobre os ids de cada pedido e fazer o filtro dos items por id do pedido
        const orders: Order[] = []
        setOrderIds.forEach(orderId => {
            const filteredItems = items.filter(item => item.orderId === orderId)
            const resultSetFiltered = resultSet.filter(rs => rs['order_id'] === orderId)
            const order: Order = this.ordersConverter(resultSetFiltered, filteredItems)
            // passo 4 -> converter para o objeto de order e setar na lista que será retornada
            orders.push(order)
        })

        return orders
    }

    async count(orderStatus: string, initDate: string, endDate: string): Promise<number> {
        const data = await this.datasource.query(queries.count, `%${orderStatus}%`, initDate, endDate)
        return data[0][0]['total'] as number
    }

}