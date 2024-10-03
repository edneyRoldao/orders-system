import { PaymentExecutor } from './payment-executor'
import { PaymentDTO } from './payment.dto'

export class PayPix extends PaymentExecutor {

    async execute(paymentInstrument: PaymentDTO): Promise<void> {
        console.log('executando pagamento via pix')
        
    }

}