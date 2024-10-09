import client, { Connection, Channel, ConsumeMessage } from 'amqplib'

export class RabbitMQConnection {
    channel?: Channel
    connection?: Connection
    private isConnected?: boolean

    private readonly USER = 'admin'
    private readonly PASS = 'admin'
    private readonly PORT = '5672'
    private readonly HOST = '192.168.176.2'
    private readonly PROTOCOL = 'amqp'

    async connect (): Promise<void> {
        // amqp://admin:admin@localhost:5672
        try {
            if (this.isConnected && !!this.channel) return
            console.log('Connecting to RabbitMQ Message Server')
            const url = `${this.PROTOCOL}://${this.USER}:${this.PASS}@${this.HOST}:${this.PORT}`
            this.connection = await client.connect(url)            
            this.channel = await this.connection.createChannel()
            this.isConnected = true
            console.log('rabbitMQ connection succeeded!')
            
        } catch (error) {
            this.isConnected = false
            console.error('There was an error while trying to connect RabbitMQ server')                        
            console.error(error);
        }
    }

    listen (queue: string): Promise<string> {
        console.log('consuming messages...')
        return new Promise(async (resolve, reject) => {
            await this.channel?.assertQueue(queue, { durable: true })            
            const callback = (msg: client.ConsumeMessage | null) => {
                if (!msg) return reject('Invalid incoming message')
                const message = msg.content.toString()
                this.channel?.ack(msg)
                resolve(message)
            }
            this.channel?.consume(queue, callback, { noAck: false })            
        })
    }

}