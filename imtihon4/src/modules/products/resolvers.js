import model from './model.js'
import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'

export default {
	Mutation: {
		addProduct: async (_, args, context) => {
			try {
				const { createReadStream, filename, mimetype, encoding } = await args.file.file
				let token = context.token

				if(!token) {
					throw new Error('Token is required')
				}

				
				const { role } = jwt.verify(token, process.env.PG_SECRET_KEY)
				
				if(role == 'admin') {
					if(!['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype)) throw new Error("Invalid file type!")
					const fileName = '/' + Date.now() % 1000 + filename.trim()
					args['file_path'] = fileName
					const product = await model.addProduct(args)

					if(product) {
						if(product.length > 0) {
							const stream = createReadStream()
      						const fileAddress = path.join(process.cwd(), 'src', 'files', fileName)
      						const out = fs.createWriteStream(fileAddress)
      						stream.pipe(out)
							return {
								status: 200,
								message: "The product has been added",
								data: product
							}
						}
						else {
							throw new Error("Invalid arguments")
						}
					}
					else {
						throw new Error("Invalid arguments")
					}
				} else {
					throw new Error("This route is private")
				}
			} catch(error) {
				return {
					status: 400,
					message: error.message
				}
			}
		},

		changeProduct: async (_, args, context) => {
			try {

				let token = context.token

				if(!token) {
					throw new Error('Token is required')
				}

				const { role } = jwt.verify(token, process.env.PG_SECRET_KEY)
								
				if(role == 'admin') {
					const product = await model.changeProduct(args)
					if(product) {
						if(product.length == 0) {
							throw new Error("There is no such product!")
						}
						return {
							status: 200,
							message: "The product has been changed",
							data: product
						}
					}else {
						throw new Error("There is no such product!")
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

		deleteProduct: async (_, args, context) => {
			try {

				let token = context.token

				if(!token) {
					throw new Error('Token is required')
				}

				const { role } = jwt.verify(token, process.env.PG_SECRET_KEY)
								
				if(role == 'admin') {
					const product = await model.deleteProduct(args)
					if(product.length == 0) {
						throw new Error("There is no such product!")
					}
					return {
						status: 200,
						message: "The product has been deleted",
						data: product
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
		products: async (_, args) => {
			return await model.products(args)
		},
	},

	Product: {
		productId: parent => parent.product_id,
		categoryId: parent => parent.category_id,
		productName: parent => parent.product_name,
		productPrice: parent => parent.product_name
	},
}