import { OrderValidatorClientImpl } from '../clients/impl/order-validator-client.impl'
import { CategoryRepositoryImpl } from '../repositories/impl/category-repository.impl'
import { CustomerRepositoryImpl } from '../repositories/impl/customer-repository.impl'
import { OrderRepositoryImpl } from '../repositories/impl/order-repository.impl'
import { ProductRepositoryImpl } from '../repositories/impl/product-repository.impl'
import { CustomerServiceImpl } from '../services/impl/customer-service.impl'
import { OrderServiceImpl } from '../services/impl/order-service.impl'
import { ProductServiceImpl } from '../services/impl/product-service.impl'
import { OrderValidatorCustomerImpl } from '../validators/impl/order-validator-customer.impl'
import { OrderValidatorPriceImpl } from '../validators/impl/order-validator-price.impl'
import { OrderValidatorProductImpl } from '../validators/impl/order-validator-product.impl'
import { OrderValidatorStockImpl } from '../validators/impl/order-validator-stock.impl'
import { RedisCacheAdapter } from './cache/redis-cache.adapter'
import { MongoAdapter } from './database/mongo-adapter'
import { MySqlAdapter } from './database/mysql-adapter'
import { RabbitMQAdapter } from './messaging/rabbitmq.adapter'

export class Container {

    static instance: Container    
    dependencies: { [name: string]: any } = {}
    
    private constructor () {}

    static getInstance () {
        if (!Container.instance) Container.instance = new Container()
        return Container.instance
    }

    register () {
        // adapters
        this.dependencies['mysql'] = new MySqlAdapter()
        this.dependencies['mongo'] = new MongoAdapter()
        this.dependencies['cache'] = new RedisCacheAdapter()
        this.dependencies['messagePublisher'] = new RabbitMQAdapter()

        // services
        this.dependencies['orderSvc'] = new OrderServiceImpl()
        this.dependencies['customerSvc'] = new CustomerServiceImpl()
        this.dependencies['productSvc'] = new ProductServiceImpl()

        // repositories
        this.dependencies['orderRepo'] = new OrderRepositoryImpl()
        this.dependencies['productRepo'] = new ProductRepositoryImpl()
        this.dependencies['categoryRepo'] = new CategoryRepositoryImpl()
        this.dependencies['customerRepo'] = new CustomerRepositoryImpl()

        // validators
        this.dependencies['orderValidatorStock'] = new OrderValidatorStockImpl()
        this.dependencies['orderValidatorCustomer'] = new OrderValidatorCustomerImpl()
        this.dependencies['orderValidatorProduct'] = new OrderValidatorProductImpl()
        this.dependencies['orderValidatorPrice'] = new OrderValidatorPriceImpl()   
        
        // clients
        this.dependencies['orderValCli'] = new OrderValidatorClientImpl()
    }

    getDependency (name: string) {
        if (!this.dependencies[name]) throw new Error('Dependency not Found')
        return this.dependencies[name]
    }

    getDependencies (name: string) {
        const list = []
        for (const key in this.dependencies) {
            if (key.startsWith(name)) {
                list.push(this.dependencies[key])
            }
        }
        return list
    }

}

export function Inject (name: string) {
	return function (target: any, propertyKey: string) {
        Object.defineProperty(target, propertyKey, { get: () => {
            const container = Container.getInstance()
            return container.getDependency(name)
        } })
	}
}

export function InjectArray (name: string) {
	return function (target: any, propertyKey: string) {
        Object.defineProperty(target, propertyKey, { get: () => {
            const container = Container.getInstance()
            return container.getDependencies(name)
        } })
	}
}
