import axios from 'axios'
import { PayDebit } from './pay-debit'
import { PayPix } from './pay-pix'
import { PaymentExecutor } from './payment-executor'
import { PaymentDTO } from './payment.dto'
import { PaymentRepository } from './payment.repository'
import { sleep, genereteUUISimple } from './utils'

export class PaymentService {

    private paymentRepository: PaymentRepository

    constructor() {
        this.paymentRepository = new PaymentRepository()
    }

    async pay(paymentInstrument: PaymentDTO): Promise<any> {
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
            return await this.paymentRepository.create(paymentInstrument, 'SUCCESS', 'success')
                    
        } catch (error: any) {
            await this.paymentRepository.create(paymentInstrument, 'FAILED', error.message)            
        }
    }

    async getPaymentByOrderCode(orderCode: string): Promise<any> {
        const payment = await this.paymentRepository.getByOrderCode(orderCode)
        const { _id, ...paymentSanitisize } = payment.toObject()
        return paymentSanitisize
    }

    async partnerWebhookExecution(payment: any): Promise<void> {
        // endpoint rules
        // method: post
        // header: payment-provider-token
        // body: payment

        console.log('chamando o webhook');
        
        const url = this.getPartnerWebhookHOST(payment.partnerId) + '/payment-status'

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': this.generatePartnerWebhookToken(payment.partnerId)
        }
         
        try {
            const response = await axios.post(url, payment, { headers })

            if (response.status >= 200 && response.status < 300) {
                // atualizar algum documento informando que o webhook recebeu o pagamanto
            } else {
                // vai acontecer quando o endpoint existir, mas ocorrer um erro interno (500)
                // deve atualizar algum documento informando que o webhook nao devolveu sucesso
                // incrementa o numero das tentativas
            }
            
        } catch (error: any) {
            console.log(error.message);            
            // vai acontecer quando o endpoint do parceiro nao existir ou estiver down
            // deve atualizar algum documento informando que o webhook nao devolveu sucesso
            // incrementa o numero das tentativas
        }
    }

    private getPartnerWebhookHOST(partnerId: string): string {
        return 'http://localhost:3000'
    }

    private generatePartnerWebhookToken(partnerId: string): string {
        return genereteUUISimple()
    }

}