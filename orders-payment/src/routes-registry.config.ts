import { Express } from 'express-serve-static-core'
import orderPaymentRouter from './order-payment.router'

export class RoutesRegistryConfig {

    constructor(private readonly app: Express) {}

    register() {
        this.app.use('/orders-payment', orderPaymentRouter)
    }

}
