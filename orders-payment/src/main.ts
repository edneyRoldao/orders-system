import { mongooseConnect } from './mongo.config'
import { ExpressServerConfig } from './express-server.config'
import { MessageListenersRegistry } from './message-listeners.registry'

mongooseConnect()

new MessageListenersRegistry()
    .register()

new ExpressServerConfig()
    .basicConfig()
    .routesRegistry()
    .startServer()
