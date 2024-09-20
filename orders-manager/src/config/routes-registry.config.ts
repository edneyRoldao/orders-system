import { Express } from 'express-serve-static-core'
import productRouter from '../routes/product.router'
import customerRouter from '../routes/customer.router'
import orderRouter from '../routes/order.router'

export class RoutesRegistryConfig {

    constructor(private readonly app: Express) {}

    register() {
        this.app.use('/api/orders', orderRouter)
        this.app.use('/api/products', productRouter)
        this.app.use('/api/customers', customerRouter)
    }

}
