import { PayDebit } from './pay-debit'
import { PayPix } from './pay-pix'
import { PaymentExecutor } from './payment-executor'
import { PaymentDTO } from './payment.dto'
import { PaymentRepository } from './payment.repository'
import { sleep } from './utils'

export class PaymentService {

    private paymentRepository: PaymentRepository

    constructor() {
        this.paymentRepository = new PaymentRepository()
    }

    async pay(paymentInstrument: PaymentDTO): Promise<void> {
        await sleep(10000)
        let paymentExecutor: PaymentExecutor

        switch (paymentInstrument.method) {
            case 'PIX':
                paymentExecutor = new PayPix()
                break
            case 'DEBIT':
                paymentExecutor = new PayDebit()
                break
            default:
                throw new Error(`payment method is not valid or is not implemented yet. method=${paymentInstrument.method}`)
        }

        try {
            await paymentExecutor.execute(paymentInstrument)
            await this.paymentRepository.create(paymentInstrument, 'SUCCESS', 'success')
            
        } catch (error: any) {
            await this.paymentRepository.create(paymentInstrument, 'FAILED', error.message)            
        }
    }

    async getPaymentByOrderCode(orderCode: string): Promise<any> {
        const payment = await this.paymentRepository.getByOrderCode(orderCode)
        const { _id, ...paymentSanitisize } = payment.toObject()
        return paymentSanitisize
    }

}