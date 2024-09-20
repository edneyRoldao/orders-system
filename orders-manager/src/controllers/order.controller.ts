import { Request, Response } from 'express'
import { Inject } from '../config/container.config'
import { OrderService } from '../services/order.service'
import { DateUtils } from '../utils/date.utils'

import axios from 'axios'

export class OrderController {

    @Inject('orderSvc')
    private service!: OrderService

    constructor () {
        this.create = this.create.bind(this)
        this.getByCode = this.getByCode.bind(this)
        this.getAll = this.getAll.bind(this)
        this.pay = this.pay.bind(this)
    }

    async create(req: Request, res: Response) {
        try {
            const orderCode = await this.service.create(req.body)
            res.status(201).json({ orderCode })
            
        } catch (error: any) {
            const errors = JSON.parse(error.message)
            res.status(400).json(errors)
        }
    }

    async getByCode(req: Request, res: Response) {
        try {
            const code = req.params.code
            const order = await this.service.getByCode(code)
            res.status(200).json(order)
            
        } catch (error: any) {
            const errors = JSON.parse(error.message)
            res.status(400).json(errors)            
        }
    }

    async getAll(req: Request, res: Response) {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10
        const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber as string) : 1
        const orderStatus = req.query.orderStatus as string || ''
        const createdInit = req.query.createdInit as string || '2010-01-01 00:00:00'
        const createdEnd = req.query.createdEnd as string || DateUtils.getCurrentDate()
        const orders = await this.service.getAll(pageSize, pageNumber, orderStatus, createdInit, createdEnd)
        res.status(200).json(orders)
    }

    async pay(req: Request, res: Response) {
        const orderCode = req.params.code
        console.log('codigo do pedido:', orderCode);

        // call orders-payment
        const response = await axios.post('http://localhost:3030/orders-payment/pay', {})

        res.status(200).json('teste pagar')   
    }

}
