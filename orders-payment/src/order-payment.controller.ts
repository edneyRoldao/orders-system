import { Request, Response } from 'express'
import { sleep } from './utils'

export class OrderPaymentController {

    constructor () {
        this.payOrder = this.payOrder.bind(this)
    }

    async payOrder (req: Request, res: Response) {
        await sleep(25000)
        res.status(201).json({ message: 'order has been payed'})
    }
    
}