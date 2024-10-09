import { RabbitMQConnection } from './rabbitmq-connection'

async function orderPaymentListener() {
    const rabbitConnection = new RabbitMQConnection()
    await rabbitConnection.connect()

    const message = await rabbitConnection.listen('node_test_msg')
    console.log(message);
    
    console.log('message has been read and consumed')
}

export default orderPaymentListener