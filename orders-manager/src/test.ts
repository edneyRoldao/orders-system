import { RabbitMQAdapter } from './config/messaging/rabbitmq.adapter'

const rabbitPublisher = new RabbitMQAdapter()

const msg = {
  orderId: 1234,
  customer: 'edney',
  value: 10000
}

const queue = 'test_order_status_queue'

const options = {
  exchange: 'test_order_status_exchange',
  routingKey: 'test_order_status_key'
}

rabbitPublisher.publish(msg, queue, options).then(r => {
  console.log('message sent');  
})
