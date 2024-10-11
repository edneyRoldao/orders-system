import client, { Connection, Channel, ConsumeMessage } from 'amqplib'

export class RabbitMQConnection {

    channel!: Channel
    connection!: Connection
    private isConnected!: boolean

    private readonly USER = 'admin'
    private readonly PASS = 'admin'
    private readonly PORT = '5672'
    private readonly HOST = '192.168.176.2'
    private readonly PROTOCOL = 'amqp'

    async connect (): Promise<void> {
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

    public async listen (queue: string, callback: (message: client.ConsumeMessage | null) => void): Promise<void> {
        await this.channel?.assertQueue(queue, { durable: true })            
        this.channel.consume(queue, callback, { noAck: false })
        console.log(`>> RabbitMQConnection.listen << - start listening queue: ${queue}`)                    
    }

}