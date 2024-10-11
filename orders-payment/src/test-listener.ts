import { PaymentDTO } from './payment.dto'
import { RabbitMQConnection } from './rabbitmq-connection'
import client from 'amqplib'

const ORDER_PAYMENT_QUEUE = 'node_test_msg'

function orderPaymentListener(connection: RabbitMQConnection): void {
    if (!connection) throw new Error('rabbitmq connection cannot by null')

    connection.listen(ORDER_PAYMENT_QUEUE, (message: client.ConsumeMessage | null) => {
        if (!message) return
        try {
            const messageAsString = message.content.toString()
            console.log(messageAsString);
            connection.channel.ack(message)    

        } catch (error) {
            console.log('There was an error while try to consume node_test_msg queue');            
        }
    })
}

export default orderPaymentListener