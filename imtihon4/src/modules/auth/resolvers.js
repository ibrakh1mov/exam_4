import model from './model.js'
import jwt from 'jsonwebtoken'

export default {
	Mutation: {
		register: async (_, {username, contact, email, password}, context) => {
			try {
				if(password < 5) throw new Error('the length of the password must be at least 5')
				if(password > 256) throw new Error('the length of the password should not exceed 15')
				if(username.length > 30) throw new Error('the length of the userName should not exceed 50')
				await model.register({username, contact, email, password})
				const [user] = await model.findUser({username, password})
				return {
					status: 200, 
					message: "The user sucsesfully registered",
					data: user,
					token: jwt.sign(user, process.env.PG_SECRET_KEY)
				}
			} catch(error) {
				return {
					status: 400,
					message: error.message
				}
			}
		},

		login: async (_, {username, password}, context) => {
			try {
				const [user] = await model.findUser({username, password})
				if(!user) throw new Error("Invalid username or password")
				return {
					status: 200,
					message: "The user sucsesfully login",
					data: user,
					token: jwt.sign(user, process.env.PG_SECRET_KEY)
				}
			} catch(error) {
				return {
					status: 400,
					message: error.message
				}
			}
		}
    }
}