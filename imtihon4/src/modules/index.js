import { makeExecutableSchema } from '@graphql-tools/schema'

import categoriesModule from './categories/index.js'
import ordersModule from './orders/index.js'
import productsModule from './products/index.js'
import authModule from './auth/index.js'
import statisticsModule from './statistics/index.js'


export default makeExecutableSchema({
    typeDefs: [
        categoriesModule.typeDefs,
        ordersModule.typeDefs,
        productsModule.typeDefs,
        authModule.typeDefs,
        statisticsModule.typeDefs
    ],
    resolvers: [
        categoriesModule.resolvers,
        ordersModule.resolvers,
        productsModule.resolvers,
        authModule.resolvers,
        statisticsModule.resolvers
    ]
})