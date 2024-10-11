import { PaymentDTO } from './payment.dto'
import { PaymentService } from './payment.service'
import { RabbitMQConnection } from './rabbitmq-connection'
import client from 'amqplib'

const ORDER_PAYMENT_QUEUE = 'order_status_queue'

const paymentService: PaymentService = new PaymentService()

function orderPaymentListener(connection: RabbitMQConnection): void {
    if (!connection) throw new Error('rabbitmq connection cannot by null')

    connection.listen(ORDER_PAYMENT_QUEUE, (message: client.ConsumeMessage | null) => {
        if (!message) return

        try {
            const paymentMessage: PaymentDTO = JSON.parse(message.content.toString())
            console.log('order_status_queue incomming message:', paymentMessage)            
            paymentService.pay(paymentMessage)
            connection.channel.ack(message)       
        } catch (error) {
            connection.channel.ack(message, false)
        }
    })
}

export default orderPaymentListener