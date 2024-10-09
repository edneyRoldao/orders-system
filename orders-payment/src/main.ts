import { mongooseConnect } from './mongo.config'
import { ExpressServerConfig } from './express-server.config'
import orderPaymentListener from './message-listeners'

mongooseConnect()
const expressServer = new ExpressServerConfig()

orderPaymentListener().then(r => {    
})

expressServer
    .basicConfig()
    .routesRegistry()
    .startServer()
