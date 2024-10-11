import { RabbitMQConnection } from './rabbitmq-connection'
import orderPaymentListener from './order-payment-listener'
import testMessageListener from './test-listener'

export class MessageListenersRegistry {

    register(): void {
        const rabbitConnection = new RabbitMQConnection()
        rabbitConnection.connect().then(() => {
            orderPaymentListener(rabbitConnection)
            testMessageListener(rabbitConnection)
        })
    }

}