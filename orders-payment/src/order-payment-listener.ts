import { PaymentDTO } from './payment.dto'
import { PaymentService } from './payment.service'
import { RabbitMQConnection } from './rabbitmq-connection'
import client from 'amqplib'

const ORDER_PAYMENT_QUEUE = 'order_status_queue'

const paymentService: PaymentService = new PaymentService()

function orderPaymentListener(connection: RabbitMQConnection): void {
    if (!connection) throw new Error('rabbitmq connection cannot by null')

    connection.listen(ORDER_PAYMENT_QUEUE, async (message: client.ConsumeMessage | null) => {
        if (!message) return

        try {
            // escutando a mensagem
            const paymentMessage: PaymentDTO = JSON.parse(message.content.toString())
            console.log('order_status_queue incomming message:', paymentMessage)            

            // executa o pagamento
            const payment = await paymentService.pay(paymentMessage) 
            
            // remove mensagem da fila
            connection.channel.ack(message)

            // chama o webhook do parceiro
            await paymentService.partnerWebhookExecution(payment)
            
        } catch (error) {
            connection.channel.ack(message, false)
        }
    })
}

export default orderPaymentListener