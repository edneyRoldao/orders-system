import devEnvironment from './dev.environment'
import prdEnvironment from './prd.environment'

// IIFE - Immediately Invoked Function Express
export default (() => {
    const env = process.env.APP_ENV
    if (!env) throw new Error('APP_ENV is not defined. You must provide a APP_ENV valid. (dev, prd)')        
    switch (env) {
        case ('dev'): return devEnvironment
        case ('prd'): return prdEnvironment
        default: throw new Error(`APP_ENV is not valid. ===> ${env} <===`)
    }
})()
