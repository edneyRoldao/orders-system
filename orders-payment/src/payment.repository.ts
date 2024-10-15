import { PaymentDTO } from './payment.dto'
import Payment from './payment.model'
import { genereteUUISimple } from './utils'

export class PaymentRepository {

    async create(paymentDTO: PaymentDTO, paymentStatus: 'SUCCESS' | 'FAILED', paymentMessage: string = 'success'): Promise<any> {
        const transactionNumber = genereteUUISimple()

        const payment = new Payment({
            amount: paymentDTO.amount,
            cardNumber: paymentDTO.cardNumber,
            transactionNumber,
            partnerId: paymentDTO.partnerId,
            method: paymentDTO.method,
            clientDocument: paymentDTO.clientDocument,
            orderCode: paymentDTO.orderCode,
            status: paymentStatus,
            statusMessage: paymentMessage
        })

        await payment.save()

        return payment
    }

    async getByOrderCode(orderCode: string): Promise<any> {
        return await Payment.findOne({ orderCode })
    }

    async getByTransactionId(transactionNumber: string): Promise<any> {
        return await Payment.findOne({ transactionNumber })
    }

}