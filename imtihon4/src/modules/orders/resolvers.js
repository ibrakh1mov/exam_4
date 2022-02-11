import model from './model.js'
import jwt from 'jsonwebtoken'

export default {
    Mutation: {
        addOrder: async (_, args, context) => {
			try {
				const token = context.token

				if(!token) {
					throw new Error('Token is required')
				}

				const { user_id, role } = jwt.verify(token, process.env.PG_SECRET_KEY)
				args['userId'] = user_id

				if(role == 'admin') {
					throw new Error ("Your role is admin")
				}

				const order = await model.addOrder(args)
				if(order) {
					if(order.length > 0) {
						return {
							status: 200,
							message: "The order has been added",
							data: order
						}
					}
					else {
						throw new Error("Invalid product!")
					}
				}
				else {
					throw new Error("Invalid product!")
				}
			} catch(error) {
				return {
					status: 400,
					message: error.message
				}
			}
		},

		changeOrder: async (_, args, context) => {
			try {
				const token = context.token

				if(!token) {
					throw new Error('Token is required')
				}

				const { user_id, role } = jwt.verify(token, process.env.PG_SECRET_KEY)
				if(role == 'admin') {
					throw new Error ("Your role is admin")
				}
				args['userId'] = user_id
				const order = await model.changeOrder(args)
				if(order) {
					if(order.length > 0) {
						return {
							status: 200,
							message: "The order has been changed",
							data: order
						}
					}
					else {
						throw new Error("Invalid order or product!")
					}
				}
				else {
					throw new Error("Invalid order or product!")
				}

			} catch(error) {
				return {
					status: 400,
					message: error.message
				}
			}
		},

		deleteOrder: async (_, args, context) => {
			try {
				const token = context.token

				if(!token) {
					throw new Error('Token is required')
				}

				const { user_id, role } = jwt.verify(token, process.env.PG_SECRET_KEY)
				if(role == 'admin') {
					throw new Error ("Your role is admin")
				}
				args['userId'] = user_id
				const order = await model.deleteOrder(args)
				if(order) {
					if(order.length > 0) {
						return {
							status: 200,
							message: "The order has been deleted",
							data: order
						}
					}
					else {
						throw new Error("Invalid order!")
					}
				}
				else {
					throw new Error("Invalid order!")
				}

			} catch(error) {
				return {
					status: 400,
					message: error.message
				}
			}
		},

		pay: async (_, args, context) => {
			try {
				const token = context.token
	
				if(!token) {
					throw new Error('Token is required')
				}
	
				const { user_id, role } = jwt.verify(token, process.env.PG_SECRET_KEY)
	
				if(role == 'admin') {
					throw new Error ("Your role is admin")
				}
	
				args['userId'] = user_id
				const paidOrders = await model.pay(args)
	
				if(paidOrders) {
					if(paidOrders.length > 0) {
						return {
							status: 200,
							message: "The orders has been paid",
							data: paidOrders
						}
					}
					else {
						throw new Error("You have no unpaid orders!")
					}
				}
			} catch(error) {
				return {
					status: 400,
					message: error.message
				}
			}
		} 
    },

    Query: {
        orders: async (_, args, context) => {
			try {
				const token = context.token

				if(!token) {
					throw new Error('Token is required')
				}

				const { user_id, role } = jwt.verify(token, process.env.PG_SECRET_KEY)
				if(!user_id) {
					throw new Error("Invalid token")
				}
				args['userId2'] = user_id
				args['role'] = role
				if(args.userId) {
					if(role == 'admin') {
						return await model.orders(args)
					}else {
						throw new Error("This orders is private")
					}
				}
				const orders = await model.orders(args)
				return orders
			} catch(error) {
				return [{
					status: 400,
					message: error.message
				}]
			}
		}
    },

    Order: {
		orderId: parent => parent.order_id,
		userId: parent => parent.user_id,
		isPaid: parent => parent.ispaid,
		productId: parent => parent.product_id,
		productName: parent => parent.product_name,
		productPrice: parent => parent.product_price
	}
}