import { OrderErrorDTO } from '../../dto/order-error.dto'
import { OrderRequest } from '../../dto/order-request.dto'
import { OrderValidator } from '../order.validator'

export class OrderValidatorCustomerImpl implements OrderValidator {

    async validate(orderRequest: OrderRequest, orderMetadata: { [name: string]: any }): Promise<OrderErrorDTO[]> {
        const errors = []

        const customer = orderMetadata['customer']

        if (!customer) {
            errors.push({ title: 'customerDocument', message: 'customer not found' })
        }

        return errors
    }

}