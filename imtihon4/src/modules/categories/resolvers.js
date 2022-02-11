import model from './model.js'
import jwt from 'jsonwebtoken'

export default {
    Mutation: {
        addCategory: async (_, args, context) => {
			try {

				let token = context.token

				if(!token) {
					throw new Error('Token is required')
				}

				
				const { role } = jwt.verify(token, process.env.PG_SECRET_KEY)
				
				if(role == 'admin') {
					if(args.categoryName > 100 || args.categoryName < 3) throw new Error("Invalid categoryName")
					const category = await model.addCategory(args)

					if(category) {
						if(category.length > 0) {
							return {
								status: 200,
								message: "The category has been added",
								data: category
							}
						}
						else {
							throw new Error("categoryName is unique!")
						}
					}
					else {
						throw new Error("categoryName is unique!")
					}
				}
				else {
					throw new Error("This route is private")
				}


			} catch(error) {
				return {
					status: 400,
					message: error.message
				}
			}
		},

		changeCategory: async (_, args, context) => {
			try {

				let token = context.token

				if(!token) {
					throw new Error('Token is required')
				}

				const { role } = jwt.verify(token, process.env.PG_SECRET_KEY)
								
				if(role == 'admin') {
					const category = await model.changeCategory(args)
					if(category.length == 0) {
						throw new Error("There is no such category!")
					}
					return {
						status: 200,
						message: "The category has been changed",
						data: category
					}
				}
				else {
					throw new Error("This route is private")
				}


			} catch(error) {
				return {
					status: 400,
					message: error.message
				}
			}
		},

		deleteCategory: async (_, args, context) => {
			try {

				let token = context.token

				if(!token) {
					throw new Error('Token is required')
				}

				const { role } = jwt.verify(token, process.env.PG_SECRET_KEY)
								
				if(role == 'admin') {
					const category = await model.deleteCategory(args)
					if(category.length == 0) {
						throw new Error("There is no such category!")
					}
					return {
						status: 200,
						message: "The category has been deleted",
						data: category
					}
				}
				else {
					throw new Error("This route is private")
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
        categories: async (_, args) => {
			return await model.categories(args)
		}
    },

    Category: {
		categoryId: parent => parent.category_id,
		categoryName: parent => parent.category_name,
	}
}