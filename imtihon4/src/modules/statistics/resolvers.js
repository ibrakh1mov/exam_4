import model from './model.js'
import jwt from 'jsonwebtoken'

export default {
    Query: {
		statistics: async (_, args, context) => {
            try {
                let token = context.token
    
                if(!token) {
                    throw new Error('Token is required')
                }
                
                const { role } = jwt.verify(token, process.env.PG_SECRET_KEY)
                if(role != 'admin') {
                    throw new Error("This route is private!")
                }
                const totalMoney_unPaid = await model.totalMoney_unpaid
                const totalMoney_paid = await model.totalMoney_paid
                const mostProduct = await model.mostProduct
                return {
                    totalMoney_paid,
                    totalMoney_unPaid
                }
            } catch(error) {
                return {
                    status: 400,
                    message: error.message
                }
            }
		},
	}
}