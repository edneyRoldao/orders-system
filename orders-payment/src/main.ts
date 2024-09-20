import { mongooseConnect } from './mongo.config'
import { ExpressServerConfig } from './express-server.config'

mongooseConnect()
const expressServer = new ExpressServerConfig()

expressServer
    .basicConfig()
    .routesRegistry()
    .startServer()
