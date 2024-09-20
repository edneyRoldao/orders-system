import { Datasource } from './datasourse'

export class MongoAdapter implements Datasource {

    async query (statement: string, ...params: any): Promise<any> {
        
    }

}