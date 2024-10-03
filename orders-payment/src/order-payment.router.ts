import express from 'express'
import { Router } from 'express-serve-static-core'
import { OrderPaymentController } from './order-payment.controller'

const router: Router = express.Router()
const controller = new OrderPaymentController()

router.get('/payment/:orderCode', controller.getOrder)

export default router
