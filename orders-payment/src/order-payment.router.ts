import express from 'express'
import { Router } from 'express-serve-static-core'
import { OrderPaymentController } from './order-payment.controller'

const router: Router = express.Router()
const controller = new OrderPaymentController()

router.post('/pay', controller.payOrder)

export default router
