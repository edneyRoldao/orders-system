import { Inject } from '../../config/container.config'
import { OrderRequest } from '../../dto/order-request.dto'
import { OrderResponseDTO } from '../../dto/order-response.dto'
import { Order } from '../../models/order'
import { OrderRepository } from '../../repositories/order.repository'
import { OrderValidatorStrategy } from '../../validators/order-validator.strategy'
import { AppUtils } from '../../utils/app.utils'
import { CustomerService } from '../customer.service'
import { OrderService } from '../order.service'
import { Paged } from '../../dto/paged'
import { MessagePublisher } from '../../config/messaging/message-publisher'
import { OrderPayRequest } from '../../dto/order-pay-request.dto'
import environment from '../../config/environments/environment'

export class OrderServiceImpl implements OrderService {

    @Inject('orderRepo') private repository!: OrderRepository
    @Inject('customerSvc') private customerService!: CustomerService
    @Inject('messagePublisher') private messagePublisher!: MessagePublisher

    private orderValidatorStrategy!: OrderValidatorStrategy

    constructor () {
        this.orderValidatorStrategy = new OrderValidatorStrategy()
    }

    async create(orderRequest: OrderRequest): Promise<OrderResponseDTO> {        
        const customer = await this.customerService.getByDocument(orderRequest.customerDocument)
        const validationErrors = await this.orderValidatorStrategy.execute(orderRequest, { customer })

        if (!!validationErrors && !!validationErrors.length) {
            throw new Error(JSON.stringify(validationErrors))
        }
                    
        const order: Order = {
            customerId: customer.id,
            code: AppUtils.genereteUUISimple()
        }

        // todo -> criar a order
        const orderSaved = await this.repository.create(order)

        // todo -> salvar os itens na tabela a products_orders
        const items = orderRequest.items.map(itemRequest => {
            return {
                orderId: orderSaved.id as number,
                productId: itemRequest.productId,
                quantity: itemRequest.quantity,
                total: itemRequest.total,
                discountPercent: itemRequest.discountPercent            
            }            
        })

        this.repository.createOrderItemBatch(items)

        return {
            id: orderSaved.id as number,
            code: orderSaved.code
        }
    }

    async getByCode(code: string): Promise<Order> {
        return await this.repository.getByCode(code)
    }
    
    async getAll(pageSize: number, pageNumber: number, orderStatus: string, initDate: string, endDate: string): Promise<Paged<Order>> {
        const totalItems = await this.repository.count(orderStatus, initDate, endDate)
        const orders = await this.repository.getAll(pageSize, pageNumber, orderStatus, initDate, endDate)
        const ordersPaged = new Paged<Order>(pageNumber, orders, totalItems)
        return ordersPaged
    }

    async pay(orderPayRequest: OrderPayRequest): Promise<void> {
        const order = await this.getByCode(orderPayRequest.code)

        if (!order || !order.id) {
            throw new Error('Order not found')
        }

        if (order.statusPayment === 'NOT_PAID') {
            await this.messagePublisher.publish(orderPayRequest, environment.ORDER_PAYMENT_QUEUE)
        }
    }


}