import { InjectArray } from '../config/container.config'
import { OrderErrorDTO } from '../dto/order-error.dto'
import { OrderRequest } from '../dto/order-request.dto'
import { OrderValidator } from './order.validator'

export class OrderValidatorStrategy {

    @InjectArray('orderValidator') 
    private orderValidators!: OrderValidator[]

    async execute(orderRequest: OrderRequest, orderMetadata: { [name: string]: any }): Promise<OrderErrorDTO[]> {
        let outerErrors: OrderErrorDTO[] = []
        for (const validator of this.orderValidators) {
            const innerErrors = await validator.validate(orderRequest, orderMetadata)
            outerErrors = [...outerErrors, ...innerErrors]
        }
        return outerErrors
    }

}